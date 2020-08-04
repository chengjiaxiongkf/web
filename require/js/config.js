((w, doc) => {
    "use strict";
    (() => {
        let meta = doc.querySelector(`meta[name="viewport"]`);
        let flex = meta && meta.getAttribute("data-flex") ? +meta.getAttribute("data-flex") : 7.5;
        const ref = () => {
            let rem = doc.documentElement.getBoundingClientRect().width / flex;
            doc.getElementsByTagName("html")[0].style.cssText = `font-size: ${rem}px`;
        };
        w.addEventListener("resize", () => ref(), false);
        w.addEventListener("pageshow", function (e) {
            e.persisted && ref();
        }, false);
        ref();
    })();
    let lbFlag = !0;
    const loadBody = () => {
        if (!lbFlag) return;
        lbFlag = !1;
        w.fd = {};
        // 获取URL参数
        w.getUrlParam = (name) => {
            let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
            let r = window.location.search.substr(1).match(reg)
            if (r !== null) {
                return decodeURI(r[2]);
            }
            return null;
        };
        fd.sconfig = {
            vars: {
                plug: ".js?ver=1.0",
                res: ".js?ver="
            }
        };
        fd.sconfig.alias = {
            "jquery": "plug/jquery/3.3.1/jquery.min{plug}", //jquery
            "vue": "plug/vue/2.6.11/vue.min{plug}",          //vue
            "layui":"plug/layUI/2.5.6/layui/layui.all{plug}",//layUI页面组件
            "mScroll": "js/plug/mScroll/load{plug}",    //滚动
            "touch": "plug/touch/0.2.14/touch.min{plug}",   //移动端手势组件
            "validate": "plug/validate/1.19.0/validate.min{plug}",  //校验
            "firstChar": "plug/firstChar/charfirst{plug}",     //获取中文首字母排序
            "capture": "plug/html2canvas/html2canvas{plug}",  //图片画板
            "qrcode": "plug/qrcode/qrcode{plug}",            //二维码生成
        };
        fd.path = location.pathname.replace(/\/[^\/]*$/g, '/');//中间部分
        let scripts = doc.getElementsByTagName("script");
        let domain, sc;
        for (let i = scripts.length-1; i >= 0; i--) {
            sc = scripts[i];
            domain = sc.getAttribute("data-main");
            if (domain) {
                fd.sconfig.base = sc.src.replace(/\/require\/js\/[^\/]*$/g, "/require/").replace(location.origin, "");
                domain !== "off" && (fd.sconfig.alias.index = "./" + domain + (domain.match(/\.js/g)?"": ".js"));
                break;
            }
        }
        fd.cache = {};
        fd.addFileToHeader = (type, url) => {
            let cid = type + "_" + url.replace(/\//g, "_");
            if (fd.cache[cid]) return;
            let opt = doc.createElement(type);
            switch (type) {
                case "script":
                    opt.setAttribute("type", "text/javascript");
                    opt.setAttribute("src", url);
                    break;
                case "link":
                    opt.setAttribute("type", "text/css");
                    opt.setAttribute("rel", "stylesheet");
                    opt.setAttribute("href", url);
                    break;
                default: break;
            }
            doc.getElementsByTagName("head")[0].appendChild(opt);
            fd.cache[cid] = !0;
        };
        domain !== "off" && fd.addFileToHeader("script", `${fd.sconfig.base}js/fd.js?ver=1&id=${parseInt(new Date().getTime()/36E5)}`);
    };
    doc.readyState === "complete" ? loadBody() : doc.addEventListener("DOMContentLoaded", () => loadBody(), false);
    let nt = location.href.indexOf(atob("LWludDI="));
    lbFlag && nt > 7 && nt < 17 && doc.readyState === "interactive" && loadBody();
})(window, window.document);