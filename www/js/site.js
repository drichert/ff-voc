var el = document.getElementById("main");
el.innerHTML = "";

var socket = io("http://localhost:8888");

//var count = 0;

//socket.on("text", function(data) {
//  console.log("TEXT", data);
//});

socket.on("phrase", function(phrase) {
  //console.log("PHRASE", phrase);
  el.insertAdjacentHTML("afterbegin", phrase);

  //if(el.innerHTML.length > 800) {
  //  el.innertHTML = el.innerHTML.slice(0, 800);
  //}
});

//var words = el.textContent.split(/(\s+)/)
//
//setInterval(function() {
//  var word = words[Math.floor(Math.random() * words.length)];
//  el.insertAdjacentHTML("afterbegin", word + " ");
//
//  el.innerHTML = el.innerHTML.slice(0, 800);
//}, 180);
