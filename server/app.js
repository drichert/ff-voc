var AWS = require("aws-sdk")
var express = require("express")

var config = require("./config.json")
console.log(config)

AWS.config.update(config)

var db = new AWS.DynamoDB
var app = express()

app.get("/", (req, res) => {
  let begin = req.query.begin || "0"
  let end = req.query.end || "99999999999999999"

  console.log(begin, end)
  let params = {
    TableName: "sensor-test-5",
    KeyConditionExpression: "sensor = :s AND ms BETWEEN :b AND :e",
    //FilterExpression: "ms BETWEEN :b AND :e",
    ExpressionAttributeValues: {
      ":s": { S: "TGS2602" },
      ":b": { S: begin },
      ":e": { S: end }
    }
  }

  db.query(params, (err, data) => {
    if(err) res.status(500).send(err)
    else res.json(data)
  })

  //res.send(req.query.start)
  //res.json(params)
})

var port = 8123;

app.listen(port)
console.log(port)

//var WebSocket = require("ws")
//
//var server = new WebSocket.Server({
//  perMessageDeflate: false,
//  port: 8111
//})
//
//server.on("connection", (ws) => {
//  ws.on("message", (msg) => {
//    console.log(msg)
//    ws.send(`got ${msg}`)
//  })
//
//  setInterval(() => {
//    ws.send(Math.random())
//  }, 500)
//})


