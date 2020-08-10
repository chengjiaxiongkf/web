fd.define((require) => {
    "use strict";//严格模式
    require('vue');
    require('layui');
    let vm = new Vue({
        el:'#vueDiv',
        data:{
            isSubmit:true,//可提交标识
            loginUser:'',
            loginPassword:'',
            isFailLoginUser:true,
            isFailLoginPassword:true,
            msgLoginUser:'',
            msgLoginPassword:'',
        },
        created:()=>{
            console.info("created:..");
        },
        methods: {
            //校验数据
            check:()=>{
                let _this = fd.vm;
                if(!_this.loginUser){
                    _this.isFailLoginUser = true;
                    _this.msgLoginUser = '请输入用户名(手机号)';
                }else{
                    _this.isFailLoginUser = false;
                    _this.msgLoginUser = '';
                }
                if(!_this.loginPassword){
                    _this.isFailLoginPassword = true;
                    _this.msgLoginPassword = '请输入密码';
                }else{
                    _this.isFailLoginPassword = false;
                    _this.msgLoginPassword = '';
                }
                if(_this.isFailLoginUser || _this.isFailLoginPassword){
                    return false;
                }
                return true;
            },
            //登陆请求
            loginSubmit:()=>{
                let _this = fd.vm;
                $.ajax({
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    type:'POST',
                    url:`/SL_LOGIN/login/checkLogin.do`,
                    data:{'loginUser':_this.loginUser,'loginPassword':_this.loginPassword},
                    dataType:'json',
                    beforeSend:()=>{
                        if(!_this.check() || !_this.isSubmit){
                            return false;//取消请求
                        }
                        layer.load(0);
                        _this.isSubmit = false;//不可提交
                    },
                    success:(result)=>{
                        console.info(JSON.stringify(result));
                        fd.layer.load.hide();
                        _this.isSubmit = true;
                        if("N"===result.resultCode){
                            layer.msg('请输入正确的账号/密码', {icon: 4});
                            return;
                        }
                        location.href = '/';//跳转到首页
                    },
                    error:(e,xhr,opt)=>{
                        fd.layer.load.hide();
                        _this.isSubmit = true;
                        console.info    ("Error requesting " + opt.url + ": " + xhr.status + " " + xhr.statusText);
                    }
                });
            },
            //注册请求
            register:()=>{
                let _this = fd.vm;
                $.ajax({
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    type:'POST',
                    url:`/SL_LOGIN/login/register.do`,
                    data:{'loginUser':_this.loginUser,'loginPassword':_this.loginPassword},
                    dataType:'json',
                    beforeSend:()=>{
                        if(!_this.check() || !_this.isSubmit){
                            return false;//取消请求
                        }
                        layer.load(0);
                        _this.isSubmit = false;//不可提交
                    },
                    success:(result)=>{
                        console.info(JSON.stringify(result));
                        fd.layer.load.hide();
                        _this.isSubmit = true;
                        if("N"===result.resultCode){
                            if("账号已存在"===result.resultCode){
                                result.resultCode = "账号已被注册";
                            }
                            layer.msg(result.resultMsg, {icon: 0});
                            return;
                        }
                        layer.msg('注册成功', {icon: 1});
                    },
                    error:(e,xhr,opt)=>{
                        fd.layer.load.hide();
                        _this.isSubmit = true;
                        console.info    ("Error requesting " + opt.url + ": " + xhr.status + " " + xhr.statusText);
                    }
                });
            }
        }
    });
    fd.vm = vm;
});