'strict on';

(function (d,w) {
    d.jlettvin = d.jlettvin || {};
    d.jlettvin.rangeslider = d.jlettvin.rangeslider || {};

    d.jlettvin.rangeslider.makeSlider = function (sliders) {

        function label(id, name, n) {
            return "rangeSlider_" + id + '_' + name + '_' + n;
        }

        function activate(n, id) {
            function show(e, tag) {
                var mx = e.clientX, my = e.clientY;
                console.log('m:['+mx+','+my+']');
                function side(s, t) {
                    var ox = t.offsetLeft;
                    var px = t.offsetParent.clientWidth;
                    var dx = t.offsetWidth, dy = t.offsetHeight;
                    var cx = t.clientWidth, cy = t.clientHeight;
                    console.log(s +
                        'o:['+ox+'],' +
                        'p:['+px+']' +
                        'd:['+dx+','+dy+']' +
                        'c:['+cx+','+cy+']' +
                        '');
                }
                side(0, tag[0]);
                side(1, tag[1]);

                console.log('___________');
            }
            var target = d.getElementById(id);
            if (n == 1 || n == 3) {
                target.onmouseup   =function () {
                    $(this).attr('drag', 'false');
                };
                target.onmousedown =function () {
                    $(this).attr('drag', 'true' );
                };
            }
            if (n == 1) {
                target.onmousemove =function (e) {
                    var L = $(this).attr('id');
                    var R = L.substr(0, L.length-1)+3;
                    var S = 0;
                    var tag = [L,R].map(
                            function(i) {
                                return d.getElementById(i);
                            }
                            );

                    if (tag[S].getAttribute('drag') == 'true') {
                        show(e, tag);
                        console.log(e);
                    }
                    e.preventDefault();
                };
            } else if (n == 3) {
                target.onmousemove =function (e) {
                    var R = $(this).attr('id');
                    var L = R.substr(0, R.length-1)+3;
                    var S = 1;
                    var tag = [L,R].map(
                            function(i) {
                                return d.getElementById(i);
                            }
                            );

                    if (tag[S].getAttribute('drag') == 'true') {
                        show(e, tag);
                        console.log(e);
                    }
                    e.preventDefault();
                };
            }
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
            var indent = "\n    ";
            for (id in sliders) {
                var html = "";
                var data = sliders[id];
                var tableHTML = [
                    '\n    <table width="100%" id="rangeSlider_' + id + '">',
                    '\n    </table>'];
                var rowHTML = [
                    '\n      <tr><td>',
                    '</td></tr>'];

                for (name in data) {
                    html += '' +
                        '\n      <tr>' +
                        '\n        <td width="1%">' + name + '</td>' + 
                        '\n        <td>' +
                        item(id, name, data[name]) +
                        '\n        </td>' +
                        '\n      </tr>';
                }
                html = tableHTML[0] + html + tableHTML[1] + '\n';
                d.getElementById(id).innerHTML = html;
                //console.log(html);
            }
            for (id in sliders) {
                for (name in data) {
                    var idTarget1 = label(id, name, 1);
                    var idTarget3 = label(id, name, 3);
                    activate(1, idTarget1);
                    activate(3, idTarget3);
                }
            }
        }

        group(sliders);
    }
})(document, window);
