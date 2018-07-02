(function(ctx){
	var baseUrl = "wss://localhost:51234";
	ctx.opensocket = function(){
    var socket = new WebSocket(baseUrl);

    socket.onclose = function()
    {
       //alert("web channel closed");
        setTimeout(opensocket, 1000);
    };
    socket.onerror = function(error)
    {
        //alert("web channel error: " + error);
    };
    socket.onopen = function()
    {
        new QWebChannel(socket, function(channel) {
            ctx.bridge = channel.objects.bridge;
            //ctx.socketComplete();//��ʵ������Ƿ���Ҫ
				});
		}
	}
	opensocket();
})(window);