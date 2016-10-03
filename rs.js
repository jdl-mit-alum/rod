'strict on';

(function(d,w) {
    d.jlettvin.rangeslider = document.jlettvin.rangeslider || {};
    d.jlettvin.rangeslider.group = document.jlettvin.rangeslider.group || {};

    d.jlettvin.rangeslider.makeSlider = function (sliders) {
        function label(id, name, n) { return "rangeSlider_" + id + '_' + name + '_' + n; }
        function activate(n, id) {
            var target = d.getElementById(id);
        }
        function item(id, name, data) {
            var indent = "        ";
            var html = "";
            var number = JSON.parse('['+data.toString()+']');
            var gap = number[2]-number[1];
            var span = number[3]-number[0];
            var mean = number[1] + (0.5 * gap);
            var left = 100 * (number[1] - number[0]) / span;
            var right = 100 * (number[3] - number[2]) / span;
            var middle = 100 - left - right - 2;
            var value = [number[0], number[1], "", number[2], number[3]];
            var bgcolor = ["#DDD", "#000", "#AAA", "#000", "#DDD"];
            var color = ["#000", "#FF0", "#AAA", "#FF0", "#000"];
            var align = ["left", "right", "center", "left", "right"];
            var width = [left, 1, middle, 1, right];
            drag = ['', 'class="draggable_slider" ', '', 'class="draggable_slider" ', ''];
            for (n in [0, 1, 2, 3, 4]) {
                var idTarget = label(id, name, n);
                var style = 'color:'+color[n]+';background-color:'+bgcolor[n]+'" ';
                html += '\n            ' +
                    '<td ' +
                    'id="' + idTarget + '" ' +
                    'value="' + value[n] + '" ' +
                    'align="' + align[n] + '" ' +
                    drag[n] +
                    'style="' + style +
                    'drag="false" ' +
                    'width="' + width[n]+ '%"' +
                    '>' +
                    value[n] +
                    '</td>';
                //activate(n, idTarget);
            }
            html = '' +
                '\n          ' +
                '<table width="100%" cellpadding="0" cellspacing="0"><tr>' + html +
                '\n          ' +
                '</tr></table>';
            return indent + html;
        }
        function group(sliders) {
            var hold = d.jlettvin.rangeslider.group;
            for (id in sliders) hold[id] = sliders[id];
            for (id in sliders) {
                console.log('id:'+id);
                var data = sliders[id];
                for (name in data) {
                    console.log('name:'+name);
                    idTarget = [1,3].map(function(i) {return label(id, name, i);});
                    hold[id][name].id = idTarget;
                    //activate(1, idTarget[0]);
                    //activate(3, idTarget[1]);
                }
            }
        }

        group(sliders);
        console.log(JSON.stringify(d.jlettvin.rangeslider.group));
    }
})(document, window);
