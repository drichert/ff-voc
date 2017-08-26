var el = document.getElementById("main");

var socket = io("http://localhost:8888")

socket.on("text", function(data) {
  console.log("TEXT", data)
}, 

//var words = el.textContent.split(/(\s+)/)
//
//setInterval(function() {
//  var word = words[Math.floor(Math.random() * words.length)];
//  el.insertAdjacentHTML("afterbegin", word + " ");
//
//  el.innerHTML = el.innerHTML.slice(0, 800);
//}, 180);
