'strict on';

(function(d,w) {
// STRUCTURE //////////////////////////////////////////////////////////////////
//d.jlettvin.service.actualize("jlettvin.plot");
if (d.jlettvin === undefined) d.jlettvin = {};
if (d.jlettvin.plot === undefined) d.jlettvin.plot = {};

function HERE(f) {
    var txt = f.toString().split('\n').slice(1,-1).join('\n').normalize('NFC');
    return txt;
}

d.jlettvin.model = {
    segment: {
      body:     {noun:'body', verb:'move', name:'A', opsins:1e8, latent:0},
      head:     {noun:'head', verb:'clip', name:'B', opsins:0e0, latent:0},
    },
    opsins: {
      rod:      1e8,
      disk:     1e5,
    },
    rate: {
      consume: 4e4,
      produce: 1e4,
      target:  1e2,  // 1e2 * 50 === 5e3 === target median opsins per second.
    },
    control: {
      doc:      null,
      index:    1,
      run:      true,
      refresh:  [50, 1000],    // 20/sec and 1/sec
      key:      {press: false},
      round:    0,
      plot:     {size: 600, index: 0},
      segment:  ['body','head'],
    },
    plot: {
      '𝛟'     : {label: '𝛟'     , color: '#FFFF00', ymin:0 , ymax:8 , data: []},
      'Opsin' : {label: 'Opsin' , color: '#00FF00', ymin:0 , ymax:8 , data: []},
      'bleach': {label: 'bleach', color: '#FFFFFF', ymin:0 , ymax:20, data: []},
      'signal': {label: 'signal', color: '#000000', ymin:-1, ymax:+1, data: []},
    },
    turtle: [  // TODO
        // data consist of:
        // [x,y,bool,color,width]
        {label: '1st', width:2, color:"#FF0000", ymin:0, ymax:1, data:[]}
    ],
    fun: {  // For mixins
      click_noop: function() {
          console.log($(this).attr('id'));
      },
      click_restart:  function() {
        console.log("restart"  );
        d.jlettvin.model.fun.restart();
      },
      click_photopic: function() {
        console.log("photopic" );
        d.jlettvin.model.fun.photopic();
      },
      click_scotopic: function() {
        console.log("scotopic" );
        d.jlettvin.model.fun.scotopic(false);
      },
      click_fulldark: function() {
        console.log("fulldark" );
        d.jlettvin.model.fun.scotopic(true);
      },
      click_pause:    function() {
        var model = d.jlettvin.model;
        var pause = d.getElementById("pause");
        var color = ["#FFCCCC", "#CCFFCC"];
        var text = [
          "<pre>\nCONTINUE\naffects\nModel/Graphing\n(energy hungry)\n</pre>",
          "<pre>\nPAUSE\naffects\nModel/Graphing\n(energy saving)\n</pre>",
        ];
        pause.style.backgroundColor = color[+model.control.run];
        console.log("pause:" + model.control.run);
        model.control.run = !model.control.run;
        pause.innerHTML = text[+model.control.run];
        if (model.control.run) d.jlettvin.model.fun.update();
      },
    }
};

function generatePhotons(Phi) {
    //return parseInt(Math.max(0, parseInt(10**Phi - 1)));
    return parseInt(Math.max(0, parseInt(Math.pow(10, Phi) - 1)));
}

function generatePhi(photons) {
    return Math.max(0, Math.log10(1 + photons));
}

function adjustToPhi(lo, hi) {
    var loPhotons = generatePhotons(lo);
    var hiPhotons = generatePhotons(hi);
    var mean = (hiPhotons + loPhotons) / 2;
    var target = model.rate.target;
    var bleach = Math.min(target, mean);  // How many opsins will bleach these
    var active = bleach * model.opsins.rod / mean;
    model.segment.body.opsins = active + target;
    model.segment.body.latent = target;
    model.segment.head.opsins = model.opsins.rod - model.segment.body.opsins;
    model.segment.head.latent = model.segment.head.opsins;
    // bleach = photons * active / opsins
    // bleach * opsins / photons = active
    //var bleach = parseInt(photons * active / model.opsins.rod);
    // using mid and opsins.rod, calculate the number of opsins needed
    // to generate minimum of either 5000 events or 1/2 Opsins events.
    // Opsins active = (Opsins current - Opsins latent)
    // Probability of capture = Opsins active divided by Opsins maximum.
    // We want Opsins active == Opsins latent
}

// MIXINS /////////////////////////////////////////////////////////////////////
var model = d.jlettvin.model;
model.fun.logI = function(lo, hi) {
  adjustToPhi(lo, hi);
  $("#photons-lo").val( 0).slider("refresh");  // extra to avoid race
  $("#photons-hi").val( 8).slider("refresh");
  $("#photons-lo").val(lo).slider("refresh");
  $("#photons-hi").val(hi).slider("refresh");
};
model.fun.wave = function(dwell, period) {
  $("#pulse-width" ).val(     0).slider("refresh");  // extra to avoid race
  $("#pulse-width" ).val( dwell).slider("refresh");
  $("#pulse-period").val( 10000).slider("refresh");
  $("#pulse-period").val(period).slider("refresh");
};

model.fun.scotopic = function(full = true) {
    model.fun.logI(  0, 2.4);
    model.fun.wave(1e3, 2e3);
    if (full) {
        model.segment.body.opsins = model.opsins.rod;
        model.segment.body.latent = 0;
    }
    if (!model.control.run) model.fun.update(true);
};

model.fun.photopic = function() {
    model.fun.logI(3.6,   6);
    model.fun.wave(1e3, 2e3);
    if (!model.control.run) model.fun.update(true);
};

model.fun.restart = function() {
    model.fun.photopic();
    model.fun.logI(4.1, 6.5);  // range for 0-255
    model.control.index = 0;
    model.control.round = 0;
};

model.fun.slider = function(div, id) {
  $(div).on("slidestop", id, function (e) {
      var el = $(id);
      el.attr("value", el.val());
  });
}

model.fun.doc = function() { //force=null) {
  var it = d.getElementById("help_"+$(this).attr('id'));
  //it = force && d.getElementById(force);
  it = it || d.getElementById("help_doc");
  var wiki = d.jlettvin.wiki.markdown(it.innerHTML || "");
  d.getElementById("doc").innerHTML = wiki;
};

model.fun.update = function(run=false) {
  if (run) model.control.run = true;
  
  function tick() { return new Date().getTime(); }
  function regray(id, percent, gray) {
    var element = d.getElementById(id);
    element.setAttribute("width", percent + '%');
    element.style.backgroundColor = gray;
  }
  function convey(belt, datum) {
      belt.data = belt.data.slice(1);
      belt.data.push(datum);
  }
  function response() {
    var pulse = {
      width:    $("#pulse-width" ).val(),
      period:   $("#pulse-period").val(),
      high:     $("#photons-hi"  ).val(),
      low:      $("#photons-lo"  ).val(),
    };
    var body = model.segment.body;
    var head = model.segment.head;
    var t = tick();
    var cycle = t % pulse.period;
    var Phi = ((cycle / pulse.width) < 1.0) ? pulse.high : pulse.low;

    // Calculate current complement of available opsins.
    var active   = body.opsins - body.latent;
    // Get the current voltage level
    var voltage = model.plot.signal.data;
    // Get the previous value of signal from the plot.
    var signal = voltage[voltage.length-1];

    //*************************************************************************
    // Convert Phi to photon count.
    var photons = generatePhotons(Phi);
    // Calculate how many are captured by available opsins.
    var bleach = parseInt(photons * active / model.opsins.rod);

    // TODO develop phagocytosis and regeneration code.
    var equilibrium = model.rate.target;
    var over  = Math.max(0, bleach - equilibrium);
    var under = Math.max(0, equilibrium - bleach);
    var ratio = body.latent / body.opsins;
    console.log(body.latent + ' : ' + body.opsins + ' : ' + ratio)
    if (over > 0) {
        if (over > model.rate.consume) over = model.rate.consume;
        if (over > body.opsins       ) over = body.opsins;
        body.opsins -= over;
        body.latent -= over * ratio;
        head.opsins += over;
    //} else if (ratio > 0.5) {
        //var bite = Math.min(model.rate.consume, body.opsins / 2);
        //body.opsins -= bite;
    }
    if (under > 0) {
        var permit = model.opsins.rod - body.opsins;
        if (under > permit) under = permit;
        body.opsins += under;
        head.opsins -= under;
    }
    var naive = (over ? 1 : 0) - (under ? 1 : 0);

    var convert = Math.tanh((bleach - equilibrium) /  10000);

    //*************************************************************************
    convey(model.plot['𝛟'], Phi);
    convey(model.plot.Opsin, generatePhi(active));
    convey(model.plot.bleach, generatePhi(bleach));
    //console.log(over + ':' + under + ':' + naive)
    convey(model.plot.signal, naive);

    // Increase the count of latent (used up) opsins.
    body.latent = Math.min(body.opsins, body.latent + bleach);
  }
  function redrawAbstractModel() {
    var plot = model.plot;

    response();
    for (var name of model.control.segment) {
      var tuple = model.segment[name];
      var percent = parseInt(100 * tuple.opsins / model.opsins.rod);
      var R, G, B, I;
      var ratio = tuple.latent / tuple.opsins;
      I = parseInt(255 * ratio);
      if (name === 'head') { R = 255; G = 192; B = 192; }
      else                 { R =      G =      B =   I; }
      regray(tuple.name, percent, "rgb("+R+","+G+","+B+")");
    }
  }
  function replot() {
    var canvasName = "plotFrame";
    var line = model.plot;
    var plot = d.jlettvin.plot.draw;
    var shape = {
      width: 600,
      height: 200,
      margin: 10,
      frame: {color:"#707070"},
      grid: {color:"#878787"},
      back: {color:"#787878"},
      font: {size:20, face:"Monospace"},
    };
    lines = [line["𝛟"], line["Opsin"], line["bleach"], line["signal"]];
    plot(canvasName, lines, shape);
  }
  function update() {
    var control = model.control;
    if (model.control.run) {
      setTimeout(model.fun.update, control.refresh[control.index]);
      redrawAbstractModel();
      replot();
      control.round++;
    }
  }

  update();
};

$(d).ready(function () {
  // MAIN /////////////////////////////////////////////////////////////////////
  function resize() {
    model.control.run = true;
    model.fun.click_pause();
    model.fun.update();
  }

  function main() {
    var fun = model.fun;

    // Initialize data;
    var Phi = '𝛟', Opsin = 'Opsin', bleach = 'bleach', signal = 'signal';
    model.plot[Phi   ].data = [];
    model.plot[Opsin ].data = [];
    model.plot[bleach].data = [];
    model.plot[signal].data = [];
    for (var i = 0; i < model.control.plot.size; i++) {
        model.plot[Phi   ].data[i] = 0;
        model.plot[Opsin ].data[i] = 0;
        model.plot[bleach].data[i] = 0;
        model.plot[signal].data[i] = 0;
    }

    // Enable use of sliders to control square wave parameters.
    model.fun.slider("#photons", "#photons-lo"  );
    model.fun.slider("#photons", "#photons-hi"  );
    model.fun.slider("#timing" , "#pulse-width" );
    model.fun.slider("#timing" , "#pulse-period");

    // Enable objects to resize when the window resizes.
    w.addEventListener("resize", resize, false);

    // Enable mouse enter/click to drive functions.
    function mousify(id, click) {
        var element = d.getElementById(id);
        element.onclick      = click;
        element.onmouseenter = fun.doc;
        element.onmouseleave = fun.doc;
    }
    mousify("photoreceptor", fun.click_noop       );
    mousify("model-div"    , fun.click_noop       );
    mousify("title"        , fun.click_noop       );
    mousify("legal"        , fun.click_noop       );
    mousify("restart"      , fun.click_restart    );
    mousify("photopic"     , fun.click_photopic   );
    mousify("scotopic"     , fun.click_scotopic   );
    mousify("fulldark"     , fun.click_fulldark   );
    mousify("pause"        , fun.click_pause      );
    mousify("timing"       , fun.click_noop       );
    mousify("photons"      , fun.click_noop       );
    mousify("plotFrame"    , fun.click_pause      );
    mousify("TODO"         , fun.click_noop       );
    mousify("instant_help" , fun.click_noop       );
    mousify("references"   , fun.click_noop       );

    if (false) {
      // Keyboard pause/continue doesn't play nice with workspace changes.
      // Enable use of keyboard keyup event as pause/continue event.
      $(w).keyup(function() {
        model.control.key.press && model.fun.click_pause();
        model.control.key.press = false;
      });
      $(w).keydown(function() { model.control.key.press = true; });
    }

    // Reset to starting condition and fire off first event response.
    model.fun.restart();
    model.fun.doc();
    model.fun.update();
  }

  // Enable sketching on the canvas
  //$(function() { $('#plotFrame').sketch(); });

  main();
});
})(document, window);
