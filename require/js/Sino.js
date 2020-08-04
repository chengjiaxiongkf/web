(function(w) {
    "use strict";
    //字符串去前后空格方法封装
    !String.prototype.trim && (String.prototype.trim = function () {
        let m = this.match(/^\s*(\S+(\s+\S+)*)\s*$/);
        return (m === null) ? '' : m[1];
    });
    //小于10自动补零
    Number.prototype.full = String.prototype.full = function() {
        return this < 10 ? '0' + this : this;
    };
    //当天的时间戳不含时分秒
    Date.prototype.timeStamp = function() {
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0);
        return this.getTime();
    };
    //日期格式化
    Date.prototype.dateFormat = function(fm = "yy-mm-dd") {
        fm = fm === "yyyy-MM-dd"?"yyyy-mm-dd":fm;//模拟java写法
        return fm.replace(/y+/g, this.getFullYear())
            .replace(/mm/g, (this.getMonth() + 1).full())
            .replace(/m/g, this.getMonth() + 1)
            .replace(/dd/g, this.getDate().full())
            .replace(/d/g, this.getDate())
            .replace(/h+/g, this.getHours().full())
            .replace(/M+/g, this.getMinutes().full())
            .replace(/s+/g, this.getSeconds().full());
    };
    //计算年龄(周岁)
    Date.prototype.getAge = function() {
        let [by, bm, bd, now] = [this.getFullYear(), this.getMonth(), this.getDate(), new Date];
        let [ny, nm, nd] = [now.getFullYear(), now.getMonth(), now.getDate()];
        let age = ny - by;
        if (nm < bm || (nm === bm && nd < bd)) age--;
        return age;
    };
    //根据身份证计算年龄
    String.prototype.getAge = function() {
        let str = "";
        if (/^\d{14}[\dxX]{1}$/g.test(this)) {
            str = `${this.substr(6,2) - 0 + 1900}/${this.substr(8, 2)}/${this.substr(10, 2)}`;
        } else if (/^\d{17}[\dxX]{1}$/g.test(this)) {
            str = `${this.substr(6,4)}/${this.substr(10, 2)}/${this.substr(12, 2)}`;
        } else str = this.replace(/\.|-/g, "/");
        return new Date(str).getAge();
    };
    //字符串转日期
    String.prototype.getDate = function(fm) {
        if (/^\d{17}[\dxX]$/g.test(this)) {
            let bir = this.replace(/^\d{6}(\d{4})(\d\d)(\d\d)\d+[Xx]?$/g, "$1-$2-$3");
            if (fm) return new Date(bir.replace(/-/g, "/")).dateFormat(fm);
            return bir;
        } else
        return "";
    };
    String.prototype.getSex = function() {
        let obj = {};
        if (/^\d{17}[\dxX]$/g.test(this)) {
            if (this.substr(16, 1) % 2 === 1) {
                obj = {code: "1", title: "男"};
            } else {
                obj = {code: "2", title: "女"};
            }
        }
        return obj;
    };
    Date.prototype.addFullYears = function(n = 0) {
        this.setFullYear(this.getFullYear() + n);
        this.setDate(this.getDate() + (n < 0 ? 1 : n === 0 ? 0 : -1));
        return this;
    };
    Date.prototype.addMonths = function(n = 0) {
        this.setMonth(this.getMonth() + n);
        this.setDate(this.getDate() + (n < 0 ? 1 : n === 0 ? 0 : -1));
        return this;
    };
    Date.prototype.addDays = function(n = 0) {
        this.setDate(this.getDate() + parseInt(n));
        return this;
    };
    Number.prototype.addDays = String.prototype.addDays = function(n) {
        return new Date(/^\d+$/g.test(this) ? this - 0 : this.replace(/[^\d]/g, "/")).addDays(n);
    };
    Number.prototype.dateFormat = String.prototype.dateFormat = function(fm) {
        return this.addDays(0).dateFormat(fm);
    };
    Number.prototype.toNumber = String.prototype.toNumber = function() {
        return Number(this);
    };

    let fd = w.fd || {};

    //是否为测试环境base64字符编码 atob("LWludDI=") === btoa("-int2")
    let TEST = w.location.href.substr(7, 10).indexOf(atob("LWludDI=")) > 0;
    //是否为服务器环境base64字符编码 atob("NDcuOTUuMjIxLjE2OQ==") === btoa("47.95.221.169")
    let PRD = w.location.host.indexOf(atob('NDcuOTUuMjIxLjE2OQ=='))>=0;
    //是否为本地环境base64字符编码 atob("bG9jYWxob3N0==") === btoa("localhost")
    let loc = w.location.host.indexOf(atob('bG9jYWxob3N0'))>=0;
    //nginx主页路径从根目录找不到js
    let indexName = 'index';
    if((TEST || loc || PRD) && location.href === location.origin+"/"){//本地、测试、生产加下默认首页的路径
        indexName = location.href+'index/js/'+indexName;
    }

    //工具包
    fd.util = {
        //正则表达式
        regexp :  {
            mobile: /^1[3-9]\d{9}$/g,
            email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g
        },
        // 批量获取URL参数
        getUrlParams :()=> {
            let arr = [];
            for (let i in arguments) arr.push(arguments[i]);
            return arr.map((v) => getUrlParam(v) || "");
        },
        //是否在微信
        isWechat : () => {
            let ua = navigator.userAgent.toLowerCase();
            return ua.indexOf("micromessenger") !== -1 || ua.indexOf("alipayclient") !== -1;
        },
    };

    /*! Sea.js 3.0.3 | seajs.org/LICENSE.md */
    let sea = {};
    !function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return B++}function e(a){return a.match(E)[0]}function f(a){for(a=a.replace(F,"/"),a=a.replace(H,"$1/");a.match(G);)a=a.replace(G,"/");return a}function g(a){var b=a.length-1,c=a.charCodeAt(b);return 35===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||47===c?a:a+".js"}function h(a){var b=v.alias;return b&&x(b[a])?b[a]:a}function i(a){var b=v.paths,c;return b&&(c=a.match(I))&&x(b[c[1]])&&(a=b[c[1]]+c[2]),a}function j(a){var b=v.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(J,function(a,c){return x(b[c])?b[c]:a})),a}function k(a){var b=v.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=z(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charCodeAt(0);if(K.test(a))c=a;else if(46===d)c=(b?e(b):v.cwd)+a;else if(47===d){var g=v.cwd.match(L);c=g?g[0]+a.substring(1):a}else c=v.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),f(c)}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=h(a),a=j(a),a=h(a),a=g(a),a=h(a);var c=l(a,b);return c=h(c),c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c,d){var e;try{importScripts(a)}catch(f){e=f}b(e)}function p(a,b,c,d){var e=Z.createElement("script");c&&(e.charset=c),A(d)||e.setAttribute("crossorigin",d),q(e,b,a),e.async=!0,e.src=a,ca=e,ba?aa.insertBefore(e,ba):aa.appendChild(e),ca=null}function q(a,b,c){function d(c){a.onload=a.onerror=a.onreadystatechange=null,v.debug||aa.removeChild(a),a=null,b(c)}var e="onload"in a;e?(a.onload=d,a.onerror=function(){D("error",{uri:c,node:a}),d(!0)}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&d()}}function r(){if(ca)return ca;if(da&&"interactive"===da.readyState)return da;for(var a=aa.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return da=c}}function s(a){var b=[];return a.replace(fa,"").replace(ea,function(a,c,d){d&&b.push(d)}),b}function t(a,b){this.uri=a,this.dependencies=b||[],this.deps={},this.status=0,this._entry=[]}if(!a.seajs){var u=a.seajs={version:"3.0.3"},v=u.data={},w=c("Object"),x=c("String"),y=Array.isArray||c("Array"),z=c("Function"),A=c("Undefined"),B=0,C=v.events={};u.on=function(a,b){var c=C[a]||(C[a]=[]);return c.push(b),u},u.off=function(a,b){if(!a&&!b)return C=v.events={},u;var c=C[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete C[a];return u};var D=u.emit=function(a,b){var c=C[a];if(c){c=c.slice();for(var d=0,e=c.length;e>d;d++)c[d](b)}return u},E=/[^?#]*\//,F=/\/\.\//g,G=/\/[^\/]+\/\.\.\//,H=/([^:\/])\/+\//g,I=/^([^\/:]+)(\/.+)$/,J=/{([^{]+)}/g,K=/^\/\/.|:\//,L=/^.*?\/\/.*?\//;u.resolve=m;var M="undefined"==typeof window&&"undefined"!=typeof importScripts&&z(importScripts),N=/^(about|blob):/,O,P,Q=!location.href||N.test(location.href)?"":e(location.href);if(M){var R;try{var S=Error();throw S}catch(T){R=T.stack.split("\n")}R.shift();for(var U,V=/.*?((?:http|https|file)(?::\/{2}[\w]+)(?:[\/|\.]?)(?:[^\s"]*)).*?/i,W=/(.*?):\d+:\d+\)?$/;R.length>0;){var X=R.shift();if(U=V.exec(X),null!=U)break}var Y;if(null!=U)var Y=W.exec(U[1])[1];P=Y,O=e(Y||Q),""===Q&&(Q=O)}else{var Z=document,$=Z.scripts,_=Z.getElementById("seajsnode")||$[$.length-1];P=n(_),O=e(P||Q)}if(M)u.request=o;else{var Z=document,aa=Z.head||Z.getElementsByTagName("head")[0]||Z.documentElement,ba=aa.getElementsByTagName("base")[0],ca;u.request=p}var da,ea=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,fa=/\\\\/g,ga=u.cache={},ha,ia={},ja={},ka={},la=t.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6,ERROR:7};t.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=t.resolve(b[d],a.uri);return c},t.prototype.pass=function(){for(var a=this,b=a.dependencies.length,c=0;c<a._entry.length;c++){for(var d=a._entry[c],e=0,f=0;b>f;f++){var g=a.deps[a.dependencies[f]];g.status<la.LOADED&&!d.history.hasOwnProperty(g.uri)&&(d.history[g.uri]=!0,e++,g._entry.push(d),g.status===la.LOADING&&g.pass())}e>0&&(d.remain+=e-1,a._entry.shift(),c--)}},t.prototype.load=function(){var a=this;if(!(a.status>=la.LOADING)){a.status=la.LOADING;var c=a.resolve();D("load",c);for(var d=0,e=c.length;e>d;d++)a.deps[a.dependencies[d]]=t.get(c[d]);if(a.pass(),a._entry.length)return a.onload(),b;var f={},g;for(d=0;e>d;d++)g=ga[c[d]],g.status<la.FETCHING?g.fetch(f):g.status===la.SAVED&&g.load();for(var h in f)f.hasOwnProperty(h)&&f[h]()}},t.prototype.onload=function(){var a=this;a.status=la.LOADED;for(var b=0,c=(a._entry||[]).length;c>b;b++){var d=a._entry[b];0===--d.remain&&d.callback()}delete a._entry},t.prototype.error=function(){var a=this;a.onload(),a.status=la.ERROR},t.prototype.exec=function(){function a(b){var d=c.deps[b]||t.get(a.resolve(b));if(d.status==la.ERROR)throw Error("module was broken: "+d.uri);return d.exec()}var c=this;if(c.status>=la.EXECUTING)return c.exports;if(c.status=la.EXECUTING,c._entry&&!c._entry.length&&delete c._entry,!c.hasOwnProperty("factory"))return c.non=!0,b;var e=c.uri;a.resolve=function(a){return t.resolve(a,e)},a.async=function(b,c){return t.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=z(f)?f.call(c.exports={},a,c.exports,c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=la.EXECUTED,D("exec",c),c.exports},t.prototype.fetch=function(a){function c(){u.request(g.requestUri,g.onRequest,g.charset,g.crossorigin)}function d(a){delete ia[h],ja[h]=!0,ha&&(t.save(f,ha),ha=null);var b,c=ka[h];for(delete ka[h];b=c.shift();)a===!0?b.error():b.load()}var e=this,f=e.uri;e.status=la.FETCHING;var g={uri:f};D("fetch",g);var h=g.requestUri||f;return!h||ja.hasOwnProperty(h)?(e.load(),b):ia.hasOwnProperty(h)?(ka[h].push(e),b):(ia[h]=!0,ka[h]=[e],D("request",g={uri:f,requestUri:h,onRequest:d,charset:z(v.charset)?v.charset(h):v.charset,crossorigin:z(v.crossorigin)?v.crossorigin(h):v.crossorigin}),g.requested||(a?a[g.requestUri]=c:c()),b)},t.resolve=function(a,b){var c={id:a,refUri:b};return D("resolve",c),c.uri||u.resolve(c.id,b)},t.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,y(a)?(c=a,a=b):c=b),!y(c)&&z(d)&&(c=b===s?[]:s(""+d));var f={id:a,uri:t.resolve(a),deps:c,factory:d};if(!M&&!f.uri&&Z.attachEvent&&b!==r){var g=r();g&&(f.uri=g.src)}D("define",f),f.uri?t.save(f.uri,f):ha=f},t.save=function(a,b){var c=t.get(a);c.status<la.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=la.SAVED,D("save",c))},t.get=function(a,b){return ga[a]||(ga[a]=new t(a,b))},t.use=function(b,c,d){var e=t.get(d,y(b)?b:[b]);e._entry.push(e),e.history={},e.remain=1,e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=ga[d[f]].exec();c&&c.apply(a,b),delete e.callback,delete e.history,delete e.remain,delete e._entry},e.load()},u.use=function(a,b){return t.use(a,b,v.cwd+"_use_"+d()),u},t.define.cmd={},a.define=t.define,u.Module=t,v.fetchedList=ja,v.cid=d,u.require=function(a){var b=t.get(t.resolve(a));return b.status<la.EXECUTING&&(b.onload(),b.exec()),b.exports},v.base=O,v.dir=O,v.loader=P,v.cwd=Q,v.charset="utf-8",u.config=function(a){for(var b in a){var c=a[b],d=v[b];if(d&&w(d))for(var e in c)d[e]=c[e];else y(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),v[b]=c}return D("config",a),u}}}(sea);
    sea.seajs.config(fd.sconfig);
    fd.define = sea.define;
    fd.use = function(a, b) {
        sea.seajs.use(a, b);
        return fd;
    };
    /**
     * 加入基础的jquery跟vue
     */
    fd.use(['jquery','vue','layui'], ($) => {
        //layui中的全局变量加入到fd
        fd.layui = layui;
        fd.layer = layer;
        //取消掉全局变量
        layui = undefined;
        layer = undefined;
        //自定义一个显示加载框方法
        fd.layer.load.show = (type)=>{
            fd.layer.load(type);
        }
        //自定义一个隐藏加载框方法a
        fd.layer.load.hide = ()=>{
            $(".layui-layer-shade").hide();
            $(".layui-layer.layui-layer-loading").hide();
        }

        // console.warn('将根据已有的meta标签来设置缩放比例');
        $("input").keyup(function(){
            $(this).val($(this).val().replace(/[ ]/g,""));
        }).blur(() => document.body.scrollIntoView(true));
        let port = $('meta[name=viewport]');
        let flex = port.length && port.data('flex') || 7.5;
        let html = $("html");
        html.css("font-size", $(w).width() / flex);
        $(w).resize(() => html.css("font-size", $(w).width() / flex));
        $.fn.Tmpl = function(a, b, c = () => {}) {
            let self = $(this);
            fd.use("template", (tmpl) => {
                self.html(tmpl(a.substr(1), b));
                c();
            });
            return self;
        };
        // 拨打电话
        fd.call = (mobile) => {
            iphone() && (w.location.href = `tel:${mobile}`);
        };
        fd.addStyle = (code) => {
            code += '\n';
            let head = document.getElementsByTagName("head")[0];
            let styles = head.getElementsByTagName("style");
            if (styles.length === 0) {//如果不存在style元素则创建
                if(document.createStyleSheet){ //ie
                    document.createStyleSheet();
                }else{
                    let s = document.createElement('style');//w3c
                    s.setAttribute("type", "text/css");
                    head.appendChild(s);
                }
            }
            let style = styles[0];
            style.setAttribute('type', 'text/css');
            if (style.styleSheet) { // ie
                style.styleSheet.cssText += code;
            } else if (document.getBoxObjectFor) {
                styleElement.innerHTML += code; // FF
            } else {
                style.appendChild(document.createTextNode(code));
            }
        };
        fd.Swiper = (swiper, param, callback = () => {}) => {
            fd.addFileToHeader('link', getLinkUrl('swiper'));
            fd.use('swiper', (Swiper) => callback(new Swiper(swiper, param)));
        };

        fd.getMobieScroll = (callback = () => {}) => {
            if (!$.fn.mobiscroll) {
                fd.addFileToHeader('link', getLinkUrl('mobiscroll')+"?ver=2");
                fd.use(["mobiscroll"], callback);
            } else callback();
        };
        const getTime = (t) => {
            let n = t.match(/\d+/g)[0] - 0;
            switch (t.match(/\D/g)[0]) {
                case "m": n *= 60; break;
                case "h": n *= 3600; break;
                case "D": n *= 86400; break;
                case "W": n *= 604800; break;
                case "M": n *= 2592E3; break;
                case "Y": n *= 31536E3; break;
            }
            return n;
        };
        fd.setItem = (name, str, time, jm) => {
            str = str == null || str === "null" || str === "undefined" ? "" : str;
            str = str.constructor === String ? str : JSON.stringify(str);
            if (time) {
                let obj = {};
                jm && (obj.JM = 1, str = btoa(str));
                obj.DT = str;
                obj.TM = Math.ceil((new Date().getTime() - 1548864E6) / 1E3) + getTime(time);
                str = JSON.stringify(obj);
            }
            localStorage.setItem(name, str);
        };
        fd.getItem = (name, old, back = () => {}) => {
            let flag = false;
            let s = localStorage.getItem(name);
            s = s === "null" || s === "undefined" ? null : s;
            try {
                let o = JSON.parse(s);
                if (o.TM) {
                    s = o.JM ? atob(o.DT) : o.DT;
                    if (o.TM <= Math.ceil((new Date().getTime() - 1548864E6) / 1E3)) {
                        if (old) {
                            flag = true;
                        } else {
                            localStorage.removeItem(name);
                            s = null;
                        }
                    }
                }
            } catch (e) {}
            try {
                s = JSON.parse(s);
            } catch (e) {}
            old && back(s, flag);
            return s;
        };
        fd.removeItem = function() {
            for (let i in arguments) localStorage.removeItem(arguments[i]);
        };
        const pageItem = () => location.pathname.replace(/\//g, "_").replace(/\.html$/g,"").replace(/[\w\W]+([\w\W]{25})/g, "$1");
        fd.setPageItem = (name, str) => fd.setItem(`page_${pageItem()}_${name}`, str);
        fd.getPageItem = (name) => fd.getItem(`page_${pageItem()}_${name}`);
        fd.removePageItem = (name) => fd.removeItem(`page_${pageItem()}_${name}`);

        // 获取后台服务器系统时间
        fd.getSysTime = () => {
            let time;
            $.ajax({
                url: "/SL_EFS/pub/systemTimes.do",
                async: false,
                dataType: "json",
                success: (json) => time = json,
                error: () => time = {
                    nowDateTime: new Date().getTime(),
                    nextYearTime: new Date().addDays(365).getTime(),
                    nextMonthTime: new Date().addDays(30).getTime()
                }
            });
            return time;
        };
        //不等于空
        fd.notEmpty = (s) => !(s === "" || s == null || s === "null" || s === "undefined");
        //等于空
        fd.isEmpty = (s) => !fd.notEmpty(s);
        fd.propressBar = () => {
            w.PROGRESSBAR && $(w.PROGRESSBAR).attr("loading", "compile").animate({width: "100%"}, 500, function() {
                $(this).remove();
                delete w.PROGRESSBAR;
            });
            return fd;
        };
        let idx = fd.sconfig.alias.index;
        if(!idx) {
            console.error("引用config.js时必须标签中通过data-main引用index.js");
            return;
        }
        fd.sconfig.alias.index = idx + (idx.indexOf("?")===-1?"?":"&") + 'ver=1.0';
        const IDX = () => fd.use(indexName, (obj = {}) => !obj.PROGRESSBAR && fd.propressBar());
        if(fd.util.isWechat() && TEST ) {//测试环境打开手机console控制台
            fd.use("/js/vconsole", (vc) => new vc(IDX));
        }
        IDX()
    });
})(window);