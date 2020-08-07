fd.define(()=>{
    let websocket = {};
    // 开启连接操作
    websocket.newWebsocket = (url)=>{
        //判断当前浏览器是否支持WebSocket, 主要此处要更换为自己的地址
        if ('WebSocket' in window) {
            return websocket = new WebSocket("ws://"+url);
        } else {
            alert('Not support websocket');
        }
    }
    //关闭连接操作
    websocket.closeWebSocket = ()=>{
        console.info("关闭连接xxx");
        websocket.close();
    }
    //发送消息操作
    websocket.send = (message)=> {
        console.info("发送消息:"+message);
        websocket.send(message);
    }
    //接收到消息的回调方法
    websocket.onmessage = function (event) {
        console.info("从服务器接收到消息:"+event.data);
    };
    //连接发生异常的回调方法
    websocket.onerror = ()=> {
        console.info("连接异常的回调")
    };
    //连接成功建立的回调方法
    websocket.onopen = (event)=> {
        console.info("连接成功的回调.")
        console.info("result:"+JSON.stringify(event));
    }
    //连接关闭的回调方法
    websocket.onclose =  ()=> {
        console.info("连接关闭的回调");
    }
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = ()=> {
        websocket.close();
    }
    window.websocket = websocket;
});