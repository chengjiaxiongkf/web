fd.define((require) => {
    "use strict";//严格模式
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
            //dom参数点击的dom元素
            loginSubmit:()=>{
                let _this = fd.vm;
                $.ajax({
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    type:'GET',
                    url:`/SL_USER/userInfo/getUserPort.do?loginUser=${_this.loginUser}&loginPassword=${_this.loginPassword}`,
                    dataType:'json',
                    beforeSend:()=>{
                        if(!_this.check() || !_this.isSubmit){
                            return false;//取消请求
                        }
                        fd.layer.load.show();
                        _this.isSubmit = false;//不可提交
                    },
                    success:(result)=>{
                        console.info(JSON.stringify(result));
                        fd.layer.load.hide();
                        _this.isSubmit = true;
                        if("N"===result.resultCode){
                            fd.layer.msg('请输入正确的账号/密码', {icon: 4});
                            return;
                        }
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