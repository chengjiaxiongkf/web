fd.define(() => {
    "use strict";
    fd.addStyle(`
        .mask-JCascade{position: fixed;width: 100%;height: 100%;background-color: rgba(0,0,0,0.7);top:0;left: 0;display: none;z-index: 990}
        .mask-JCascade .centerBox{position: absolute;top:50%;left: 50%;-webkit-transform: translate3d(-50%,-50%,0);transform: translate3d(-50%,-50%,0);-webkit-box-sizing: border-box;box-sizing: border-box}
        .JCascadeBox{width: 5.24rem;-webkit-border-radius: 0.1rem;-moz-border-radius: 0.1rem;border-radius: 0.1rem;background-color: #fff;-webkit-background-size: 5.24rem 0.67rem;background-size: 5.24rem 0.67rem;padding-bottom: 0.3rem}
        .JCascadeBox .JCascade-title{width: 100%;height: 1.16rem;line-height: 1.16rem;margin: 0 auto;font-size: 0.24rem;color: #fff;text-align: center;overflow: hidden;background-color: #66cbff;border-top-right-radius: 0.1rem;border-top-left-radius: 0.1rem}
        .JCascadeBox .JCascade-contain{position: relative;width: 4rem;height: 3.5rem;margin: 0.2rem auto;text-align: center;overflow: hidden;display: -webkit-box;display: flex;display: -webkit-flex}
        .JCascadeBox .JCascade-scroll{position: relative;height: 100%;overflow: hidden;width: 100%;-webkit-box-flex: 1;flex: 1;-webkit-flex: 1}
        .JCascadeBox .JCascade-contain:after, .JCascadeBox .JCascade-contain:before{position: absolute;content: '';width: 100%;height: 1px;background-color: #aaa;left: 0;-webkit-transform: scale(1,0.5);transform: scale(1,0.5)}
        .JCascadeBox .JCascade-contain:before{top: 1.4rem}
        .JCascadeBox .JCascade-contain:after{top: 2.1rem}
        .JCascadeBox .JCascade-list{position: absolute;line-height: 0.7rem;width: 100%}
        .JCascadeBox .JCascade-item{white-space: nowrap;font-size: 0.26rem;color: #666;overflow: hidden;height: 0.7rem}
        .JCascadeBox .JCascade-buttonWrap{display: -webkit-box;display: flex;display: -webkit-flex;justify-content: space-between;-webkit-justify-content: space-between;padding: 0 0.3rem}
        .JCascadeBox .JCascade-button{width: 2.2rem;height: 0.74rem;text-align: center;display: inline-block;line-height:0.74rem;background-color: #fff;font-size: 0.32rem;color: #ed5034;border: solid 1px #ed5034;-webkit-border-radius: 0.08rem;-moz-border-radius: 0.08rem;border-radius: 0.08rem}
        .JCascadeBox .JCascade-button[data-type=confirm]{color: #fff;background-color: #ed5034;border:0}
    `);
    let provType;
    switch (fd.page.PROV_TYPE) {
        case "1_6": provType = "1_6"; break;
        default: provType = "1_4"; break;
    }

    let PROV;
    $.ajax({
        async: false,
        url: `/SL_EFS/mweb/resource/plug/industry/2.0/prov_${provType}.js`,
        dataType: "text",
        type: "GET",
        success: (txt) => PROV = JSON.parse(JSON.parse(JSON.stringify(txt)))
    });

    var JCascade = function (opts) {
        opts = opts || {};
        var _this = this;
        this.scrollList = opts.scrollList || [];
        var listHtml = '';
        for(var i = 0; i < this.scrollList.length; i++){
            listHtml += '<div class="JCascade-scroll" id="'+ this.scrollList[i].id +'">\n' +
                '            <div class="JCascade-list"></div>\n' +
                '        </div>';
        }
        $("body").append(getHtml(listHtml));
        this.box = $("#JCascadeBox");
        this.box.find(".JCascade-button").on("click",function () {
            var type = $(this).attr("data-type");
            _this.box.remove();
            $.isFunction(opts.callback) && opts.callback({
                type: type,
            });
        });
    };

    function JCascadeScroll(opts){
        opts = opts || opts;
        this.params = opts.params || [];
        this.dom = opts.dom;
        this.height = this.dom.height();
        this.scrollDom = this.dom.find('.JCascade-list');
        this._scrollEnd = opts.scrollEnd;
        this.refurbish({
            list:opts.list,
            initIndex:opts.initIndex,
            type:'init',
        });
        this.scroll();
    }

    JCascadeScroll.prototype = {

        refurbish: function(opts){
            opts = opts || {};
            this.list = opts.list || [];
            this.initIndex = opts.initIndex || 0;
            this.textKey = opts.textKey || 'text';
            this.scrollDom.html(getItemHtml(this.list, this.textKey));
            this.scrollHeight = this.scrollDom.height();
            this.itemHeight = this.height/5;
            this.initY = -this.itemHeight * this.initIndex;
            this.endY = this.initY;
            this.scrollDom.css({
                top: this.itemHeight * 2 + 'px',
                transform: 'translate3d(0px, '+ this.endY +'px, 0px)',
            });
            this.scrollEnd(this.initIndex, opts.type);
        },

        scroll: function () {
            var _this = this;
            this.dom.on("touchstart",function (e) {
                e = e.originalEvent.changedTouches[0];
                _this.startY = e.pageY;
                _this.scrollDom.css({
                    transition: '0s',
                });
            }).on("touchmove",function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = e.originalEvent.changedTouches[0];
                _this.moveY = e.pageY;
                _this.dY = _this.moveY - _this.startY;
                _this.scrollDom.css({
                    transform: 'translate3d(0px, '+ (_this.endY + _this.dY) +'px, 0px)',
                });
            }).on("touchend",function (e) {
                e = e.originalEvent.changedTouches[0];
                _this.endY = _this.endY + _this.dY;
                if(_this.endY > 0){
                    _this.endY = 0;
                }else if(_this.endY < (-_this.scrollHeight + _this.itemHeight)){
                    _this.endY = -_this.scrollHeight + _this.itemHeight;
                }else {
                    var num = parseInt(Math.abs(_this.endY)/_this.itemHeight);
                    num = num + Math.round(Math.abs(_this.endY)%_this.itemHeight/_this.itemHeight);
                    _this.endY = -_this.itemHeight * num;
                }
                _this.scrollDom.css({
                    transform: 'translate3d(0px, '+ _this.endY +'px, 0px)',
                    transition: '0.1s',
                });
                var index = Math.round(Math.abs(_this.endY)/_this.itemHeight);
                _this.scrollEnd(index, 'scroll');
            })
        },

        scrollEnd: function (index, type) {
            var obj = {index: index, _type: type, value: this.list[index][this.textKey]};
            for(var i = 0; i < this.params.length; i++){
                obj[this.params[i]] = this.list[index][this.params[i]];
            }
            this.res = obj;
            $.isFunction(this._scrollEnd) && this._scrollEnd(obj);
        }

    };

    //获取html
    function getHtml(scrollHtml) {
        var html = '<div class="mask-JCascade" id="JCascadeBox" style="display: block">\n' +
            '    <div class="centerBox JCascadeBox">\n' +
            '        <div class="JCascade-title"></div>\n' +
            '        <div class="JCascade-contain">'+ scrollHtml +'</div>\n' +
            '        <div class="JCascade-buttonWrap">\n' +
            '            <div class="JCascade-button" data-type="confirm">确定</div>\n' +
            '            <div class="JCascade-button" data-type="cancel">取消</div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>';
        return html;
    }

    function getItemHtml(list, key){
        var html = '';
        for(var i = 0; i < list.length; i++){
            html += '<div class="JCascade-item">'+ list[i][key] +'</div>';
        }
        return html
    }

    /**
     * 职业选择方法
     */
    var IndustryChoice = function (opts) {
        opts = opts || {};
        this.$industryInput = opts.industryInput;
        this.$occupationInput = opts.occupationInput;
        this.industryCallback = opts.industryCallback;
        this.occupationCallback = opts.occupationCallback;
        this.noInitOccupation = opts.noInitOccupation;
        this.type = opts.type;
        this.res = {industry: {}, occupation: {}};
        this.PROV = opts.PROV || PROV;
        this.getIndustryList();
        this.getIndustrySubList(0);
        this.event();
    };

    IndustryChoice.prototype = {

        /** 获取行业列表 */
        getIndustryList: function () {
            this.industryList = [];
            if(this.PROV && this.PROV.length > 0){
                for (var i = 0; i < this.PROV.length; i++) {
                    this.industryList.push({
                        text: this.PROV[i].name,
                        code: this.PROV[i].code,
                    });
                }
            }
        },

        /** 获取行业子列表 */
        getIndustrySubList: function (index) {
            let list = this.PROV[index].list;
            this.industrySubList = [];
            if(list && list.length > 0){
                for (var i = 0; i < list.length; i++) {
                    this.industrySubList.push({
                        text: list[i].name,
                        code: list[i].code,
                    })
                }
            }
        },

        /** 获取职业列表 */
        getOccupationList: function (bigClassIndex, smallClassIndex) {
            let list;
            if(this.type === 'facility'){
                list = this.PROV[bigClassIndex].list;
            }else {
                list = this.PROV[bigClassIndex].list[smallClassIndex].list;
            }
            this.occupationList = [];
            if(list && list.length > 0){
                for (let i = 0; i < list.length; i++) {
                    this.occupationList.push({
                        text: list[i].name,
                        code: list[i].code,
                    });
                }
            }
        },

        /** 设置事件 */
        event: function () {
            if(this.type === 'facility'){
                this.initOneLevel();
            }else {
                this.initOneTwoLevel();
            }
            this.initThreeLevel();
        },

        /** 初始化一级二级 */
        initOneTwoLevel: function () {
            var _this = this;
            this.$industryInput.on("click", function () {
                _this.jCascade = new JCascade({
                    scrollList: [
                        {id: "industry-scroll",},
                        {id: "industrySub-scroll",},
                    ],
                    callback: function (res) {
                        if (res.type === "confirm") {
                            _this.res.initIndustry = true;
                            $.isFunction(_this.industryCallback) && _this.industryCallback(_this.res);
                            _this.$industryInput.val(_this.res.industry.value);
                            _this.$occupationInput && _this.$occupationInput.val('');
                            _this.getOccupationList(_this.res.industry.bigClass.index, _this.res.industry.smallClass.index);
                        }
                    }
                });
                _this.industryScroll = new JCascadeScroll({
                    dom: $("#industry-scroll"),
                    list: _this.industryList,
                    params: ["code"],
                    scrollEnd: function (res) {
                        if (res._type !== 'init') {
                            _this.getIndustrySubList(res.index);
                            _this.industrySubScroll.refurbish({
                                list: _this.industrySubList,
                            });
                            _this.res.industry.value = res.value + '/' + _this.industrySubScroll.res.value;
                            _this.res.industry.bigClass = res;
                            _this.res.industry.smallClass = _this.industrySubScroll.res;
                            _this.jCascade.box.find('.JCascade-title').text(_this.res.industry.value);
                        }
                    }
                });
                _this.industrySubScroll = new JCascadeScroll({
                    dom: $("#industrySub-scroll"),
                    list: _this.industrySubList,
                    params: ["code"],
                    scrollEnd: function (res) {
                        _this.res.industry.value = _this.industryScroll.res.value + '/' + res.value;
                        _this.res.industry.bigClass = _this.industryScroll.res;
                        _this.res.industry.smallClass = res;
                        _this.jCascade.box.find('.JCascade-title').text(_this.res.industry.value);
                    }
                });
            });
        },

        /** 初始化一级 */
        initOneLevel: function(){
            var _this = this;
            this.$industryInput.on("click", function () {
                _this.jCascade = new JCascade({
                    scrollList: [
                        {id: "industry-scroll",}
                    ],
                    callback: function (res) {
                        if (res.type === "confirm") {
                            _this.res.initIndustry = true;
                            $.isFunction(_this.industryCallback) && _this.industryCallback(_this.res);
                            _this.$industryInput.val(_this.res.industry.value);
                            _this.$occupationInput && _this.$occupationInput.val('');
                            _this.getOccupationList(_this.res.industry.index);
                        }
                    }
                });
                _this.industryScroll = new JCascadeScroll({
                    dom: $("#industry-scroll"),
                    list: _this.industryList,
                    params: ["code"],
                    scrollEnd: function (res) {
                        _this.getOccupationList(res.index);
                        _this.res.industry.value = res.value;
                        _this.res.industry = res;
                        _this.jCascade.box.find('.JCascade-title').text(_this.res.industry.value);
                    }
                });
            });
        },

        /** 初始化三级 */
        initThreeLevel: function () {
            var _this = this;
            this.$occupationInput.on("click", function () {
                if (_this.res.initIndustry) {
                    _this.jCascade = new JCascade({
                        scrollList: [
                            {id: "occupation-scroll",},
                        ],
                        callback: function (res) {
                            if (res.type === "confirm") {
                                $.isFunction(_this.occupationCallback) && _this.occupationCallback(_this.res);
                                _this.$occupationInput.val(_this.res.occupation.value);
                            }
                        }
                    });
                    _this.occupationScrol = new JCascadeScroll({
                        dom: $("#occupation-scroll"),
                        initIndex: 0,
                        list: _this.occupationList,
                        params: ["code"],
                        scrollEnd: function (res) {
                            _this.jCascade.box.find('.JCascade-title').text(res.value);
                            _this.res.occupation = res;
                        }
                    });
                }else {
                    $.isFunction(_this.noInitOccupation) && _this.noInitOccupation(_this.res);
                }
            });
        }
    };
    IndustryChoice.PROV_DATA = PROV;
    IndustryChoice.getCodeToName = (code) => {
        let arr = [];
        PROV.forEach((i) => {
            i.list.forEach((j) => {
                j.list.forEach((k) => {
                    if (k.code === code) {
                        arr = [i.name, j.name, k.name];
                    }
                });
            });
        });
        return arr;
    };
    return IndustryChoice;
});