(function() {
  var sock = new WebSocket("ws://68.37.47.14:8888")

  var el = document.getElementById("main");
  var buffer = []

  sock.onmessage = function(msg) {
    console.log(buffer.length);
    var phrase = msg.data;

    phrase = phrase.replace(/ /g, "&nbsp;");
    phrase = phrase.replace("\n", "<br>");
    phrase = phrase.replace("\t", "&nbsp;&nbsp;&nbsp;&nbps;&nbsp;");

    buffer.push(phrase);

    if(buffer.length > 20) { 
      el.innerHTML = buffer.join(" ");
      buffer = []
    }
  }
})()
