fd.define((require) => {
    "use strict";//严格模式
    require('websocket');
    websocket = websocket.newWebsocket("localhost:8020/webSocket/customer");
    //连接关闭的回调方法
    websocket.onclose =  ()=> {
        console.info("连接关闭的回调");
        $("#msgs").append($("#robotTempl").html()
            .replace("CONTEXT","您已断开连接"));
    }
    //接收消息回调
    websocket.onmessage = (event)=>{
        console.info("接收到消息的回调:"+event.data);
        let data = event.data;
        if(fd.isEmpty(data)){
            console.info("resule is null");
            return;
        }
        let array = [];
        if(data.indexOf("[") === 0){//是数组
            data = data.substr(1,data.length-2);
            array = data.split(",");
        }
        let context = "";
        if(array.length!=0){
            for(var a=0;a<array.length;a++){
                context += ">>>"+array[a];
                context += "<br/>";
            }
            $("#msgs").append($("#robotTempl").html()
                .replace("CONTEXT",context));
            $("#show").scrollTop($("#show")[0].scrollHeight);//定位到底部
            return;
        }
        $("#msgs").append($("#robotTempl").html()
            .replace("CONTEXT",data));
        $("#show").scrollTop($("#show")[0].scrollHeight);//定位到底部
    }
    //发送消息
    $("#submit").on('click',()=>{
        let text = $("#text").val();
        $("#msgs").append($("#guestTempl").html()
            .replace("DATE_TIME",new Date().dateFormat("yyyy-mm-dd hh:mm:ss"))
            .replace("CONTEXT",text));
        websocket.send(text);
        $("#text").val("");
        $("#show").scrollTop($("#show")[0].scrollHeight);//定位到底部
    });
});
