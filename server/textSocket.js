var http = require("http")
var app = http.createServer(server)
var io = require("socket.io")(app)
var fs = require("fs")

//var sensorData = require("./sensorData")
var sensorData = require("./timestampSensorData")

var server = (req, res) => {
  res.writeHead(200)
  res.end()
}

app.listen(8888);

var start = +new Date

io.on("connection", socket => {
  sensorData(+new Date).then(data => {
    console.log(data.length)
    socket.emit("text", data)
  }, err => {
    console.log("error", err)
  })
})
