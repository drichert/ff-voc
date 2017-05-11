var sock = new WebSocket("ws://localhost:8111");

sock.onmessage = function(ev) {
  var msg = ev.data;

  console.log(msg);
};

document
  .querySelector("button")
  .addEventListener("click", function(ev) {
    sock.send(ev.target.value);
  });

//console.log(sock);
