var $FF = {};

(function() {
  var sockUrl = "wss://ff.unfo.info/phrases/";
  var sock = new ReconnectingWebSocket(sockUrl, null, {
    maxReconnectAttempts: 5
  });

  $FF.sock = sock;
  var el = document.getElementById("main");
  var buffer = [];
  var limit = 20;

  sock.onmessage = function(msg) {
    console.log("buffer length: " + (buffer.length + 1));

    var phrase = msg.data;

    phrase = phrase.replace(/ /g, "&nbsp;");
    phrase = phrase.replace("\n", "<br>");
    phrase = phrase.replace("\t", "&nbsp;&nbsp;&nbsp;&nbps;&nbsp;");

    buffer.push(phrase);

    var loadingMsg = document.querySelector(".loading");
    if(loadingMsg) loadingMsg.textContent = ".".repeat(buffer.length);

    if(buffer.length > limit) {
      el.innerHTML = buffer.join(" ");
      buffer = [];
    }
  };
})();
