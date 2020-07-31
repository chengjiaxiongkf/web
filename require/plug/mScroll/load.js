fd.define((require) => {
    require("./reduce-min");
    const setVal = (that, val, code) => {
        that.data("code", code);
        that.is("input") ? that.val(val) : that.text(val).removeClass("placeholder");
    };
    let css = `${fd.sconfig.base}js/plug-in/mScroll/`;
    fd.addFileToHeader("link", `${css}style-global.css`);
    $.fn.mScroll = function(opt) {
        if (opt === "destroy" || opt === "show") {
            $(this).mobiscroll(opt);
            return $(this);
        }
        opt = $.extend({
            theme: "mobiscroll",
            preset: "select",
            onSelect: () => {}
        }, opt);
        let preset = opt.preset;
        let style = opt.theme === "mobiscroll" ? "red" : opt.theme;
        fd.addFileToHeader("link", `${css}style-${style}.css`);
        opt.onMarkupReady = (dw) => dw.addClass(`dw-${preset}`).addClass(`dw-${style}`);
        if (opt.preset === "date") opt.headerText = (v) => v;
        if (opt._setValue != null) {
            if (opt._setValue) {
                let val = opt.preset === "date" ? opt._setValue.replace(/^(\d{4})[-\/](\d\d)[-\/](\d\d)$/g, (a, b, c, d) => `${b},${c-1},${d-0}`).split(",") : [opt._setValue];
                opt.parseValue = () => val;
            }
            delete opt._setValue;
        }
        if (opt.preset === "select" && (opt._options || (opt.wheels && opt.wheels.length))) {
            let obj = {};
            if (opt.wheels && opt.wheels.length) {
                if (!opt.wheels[0][0].keys) obj = opt.wheels[0][0].values;
                else opt.wheels[0][0].values.map((v, i) => obj[opt.wheels[0][0].keys[i]] = v);
            } else if (opt._options) {
                obj = opt._options;
                if (opt._options.constructor === Array) {
                    opt.wheels = [[{values: obj}]];
                }
                if (opt._options.constructor === Object) {
                    let values = [], keys = [];
                    for (let i in obj) {
                        values.push(obj[i]);
                        keys.push(i);
                    }
                    opt.wheels = [[{values: values, keys: keys}]];
                }
                delete opt._options;
            }
            let on = opt.onSelect;
            opt.onSelect = (val) => {
                if (obj.constructor === Array) {
                    setVal($(this), val, val);
                    on(val, val);
                } else {
                    setVal($(this), obj[val], val);
                    on(obj[val], val);
                }
            };
            delete opt.preset;
        }
        // console.log(opt);
        $(this).mobiscroll(opt);
    }
});