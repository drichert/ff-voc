var $FF = {};

(function() {
  var sockUrl = "wss://ff.unfo.info/phrases/";
  var sock = new ReconnectingWebSocket(sockUrl, null, {
    maxReconnectAttempts: 5
  });

  $FF.sock = sock;
  var el = document.getElementById("main");
  var buffer = [];

  sock.onmessage = function(msg) {
    console.log(buffer.length);
    var phrase = msg.data;

    phrase = phrase.replace(/ /g, "&nbsp;");
    phrase = phrase.replace("\n", "<br>");
    phrase = phrase.replace("\t", "&nbsp;&nbsp;&nbsp;&nbps;&nbsp;");

    buffer.push(phrase);

    if(buffer.length > 20) {
      el.innerHTML = buffer.join(" ");
      buffer = [];
    }
  };
})();
