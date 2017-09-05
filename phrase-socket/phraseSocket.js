var port = parseInt(process.argv[2] || 8787)

var WebSocket = require("ws")
var server = new WebSocket.Server({ port: port })

var secret = require("./config.json").secret

server.on("connection", sock => {
  sock.on("message", msg => {
    // Message should be formatted as "secret::::phrase"
    msg = msg.split("::::")

    if(msg.length != 2) console.log("BAD MESSAGE")
    else if(msg[0] != secret) console.log("BAD SECRET")
    else {
      let phrase = msg[1]

      console.log("GOOD MESSAGE: ", phrase)

      // Broadcast phrase to all connected clients
      server.clients.forEach(client => {
        if(client !== sock && client.readyState == WebSocket.OPEN) {
          client.send(phrase)
        }
      })
    }
  })
})

console.log(`Listening on port ${port}`)
