$(document).ready(function() {
  document.jlettvin = document.jlettvin || {};
  document.jlettvin.paper = document.jlettvin.paper || {};
  var paper = document.jlettvin.paper;

  var HERE = function (f) {
    var txt = f.toString().split('\n').slice(1,-1).join('\n').normalize('NFC');
    return txt;
  };

  var doc = function (my, enter) {
    // TODO Simplify this
    var prefix = "section_";
    var paper = document.jlettvin.paper;
    var over = my.attr('id').slice(8);
    var match = (over === document.jlettvin.paper.section);
    var jqel = $("#" + prefix + over);
    if (!match) {
        if (enter) {
            document.jlettvin.paper.over = over;
            jqel.css("background-color", "#777777");
            jqel.css("color", "white");
        } else {
            over = paper.section;
            jqel.css("background-color", "white");
            jqel.css("color", "black");
        }
    }
    var section = prefix + over;
    var it = document.getElementById(over);
    it = it || document.getElementById("HELP");
    var markdown = it.innerHTML || "";
    var id = prefix + over;
    var source = document.getElementById(id);
    markdown = "= " + over + " =\n" + markdown;
    var wiki = document.jlettvin.wiki.markdown(markdown);
    document.getElementById("where_to_render").innerHTML = wiki;
  };

  var enter = function () { doc($(this), true ); };

  var leave = function () { doc($(this), false); };

  var highlight = function (before, after) {
    before.css("color", "black");
    before.css("background-color", "white");
    after.css("color", "white");
    after.css("background-color", "black");
  };

  var click_default = function () {
    var paper = document.jlettvin.paper;
    var prefix = $(this).attr('class') + '_';
    var section = $(this).attr('id').slice(prefix.length);
    var before = $('#' + prefix + paper.section);
    highlight(before, $(this));
    document.jlettvin.paper.section = section;
  };

  var newmain = function () {
      var target = document.getElementById("target");
      var framed = '\n';
      framed += '<output id="contents"></output><hr />\n';
      framed += '<output id="where_to_render"></output>\n';
      target.innerHTML = framed;
      var source = document.getElementById("source");
      var markup = source.innerHTML;
      var blocks = {_initial: ""};
      var keywrd = "_initial";
      markup.split(/\r?\n/).forEach(function(line) {
          line = line.trimRight();
          var match;
          if (match = line.match(/^\s*---\s+(\S*)\s+---\s*$/)) {
              keywrd = match[1];
              blocks[keywrd] = "";
          } else if (line === "") {
              // Do nothing.
          } else {
              blocks[keywrd] += line + '\n';
          }
      });
      var buffer = "";
      for (key in blocks) {
          if (blocks[key] !== "") buffer += "== " + key + " ==\n" + blocks[key];
      }
      var output = document.jlettvin.wiki.markdown(buffer);
      document.getElementById("where_to_render").innerHTML = output;

      //console.log(JSON.stringify(blocks));
      //var search = /^\s*---\s+(\S*)\s+---\s*$/;
      //while (markup != "") {
          //var index = markup.search(search);
          //if (-1 == index) {
              //blocks.push(markup);
              //console.log(markup);
          //} else {
              //var found = markup.slice(0, index);
              //if (found != "") blocks.append(found);
              //console.log(found);
              //markup = markup.slice(index);
          //}
      //}
      //while (res = search.exec(markup)) {
          //console.log(res[0] + ':' + res[1] + ':' + res[2]);
      //}
      //var mparts = markup.match( search );
      //console.log(JSON.stringify(mparts));
      //var output = document.jlettvin.wiki.markdown(markup);
      //document.getElementById("where_to_render").innerHTML = output;
  };

  var main = function () {
    var classname = "markup";
    var markup = document.getElementsByClassName(classname);

    var labels = "";
    for (var m = 0; m < markup.length; m++) {
      var element = markup[m];
      var id = element.getAttribute('id');
      var name = 'section_' + id;
      labels += '    <b class="section" id="' + name + '"></b>\n';
    }
    var target = document.getElementById("contents");
    target.innerHTML = labels;

    var section_name = "section";
    var sections = document.getElementsByClassName(section_name);
    for (var i = 0; i < sections.length; i++) {
      var element = sections[i];
      var id = element.getAttribute('id');
      var nbsp2 = '&nbsp;&nbsp;';
      element.innerHTML = nbsp2 + id.slice(section_name.length+1) + nbsp2;
      element.onclick    = click_default;
      element.onmouseenter = enter;
      element.onmouseleave = leave;
    }

    paper.over = paper.section = "title";
    var initial = $("#section_" + paper.section);
    highlight(initial, initial);
    doc(initial, true);
  };

  document.jlettvin.paper.main = main;
  document.jlettvin.paper.newmain = newmain;

});
