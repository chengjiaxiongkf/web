((w, doc) => {
    "use strict";
    w.cjx = {};
    let location = {
        active:'loc',
        dev:{
            url:`/`
        },
        loc:{
            url:`http://localhost:63343/web_work/`
        },
        prd:{
            url:`http://47.95.221.169/`
        }
    }
    cjx.location = location[location.active] || {};
    /**
     * require配置
     */
    require.config({
        baseUrl:`${cjx.location.url}`,
        paths:{
            'jquery':'require/plug/jquery/3.3.1/jquery.min',
            'vue':'require/plug/vue/2.6.11/vue.min',
        },
        // shims:{}
        // deps:[]
    });
    /**
     * require引用
     * @type {string}
     */
    // require(['jquery','vue']);
    require.define = define;
})(window, window.document);