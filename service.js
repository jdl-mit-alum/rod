'strict on';

(function(d, w) {
    d.jlettvin = d.jlettvin || {};
    d.jlettvin.service = d.jlettvin.service || {};

    String.format = String.format || function() {
        // http://jsfiddle.net/queryj/g109jvxd/
        // Replace numeric args like {0} and {1}
        // console.log(String.format("{1} {0}", "world", "hello"));
        var target = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var rx = new RegExp("\\{"+(i-1)+"\\}", "gm"); // global/multiline
            target = target.replace(rx, arguments[i]);
        }
        return target;
    };

    String.uncomment = String.uncomment || function (code) {
        // Remove /* comment */ blocks.
        return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
    };

    var actualize = actualize || function() {
        function ascend(branch) {
            var found = d;
            var names = branch.split(".");
            for (index in names) {
                var name = names[index];
                console.log("name:"+name);
                if (found[name] === undefined) {
                    found[name] = {};
                    found = found[name];
                }
            }
        }
        for (number in arguments) {
            tree = arguments[number];
            console.log("tree:"+tree);
            if (typeof tree === 'string') {
                ascend(tree);
            } else {
                for (index in tree) ascend(tree[index]);
            }
        }
    };

    d.jlettvin.service.actualize = actualize;
})(document, window);

