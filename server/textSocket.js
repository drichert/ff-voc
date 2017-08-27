const INTERVAL_MS = 5000

var http = require("http")
var app = http.createServer(server)
var io = require("socket.io")(app)

var AWS = require("aws-sdk")
var config = require("./config.json")
var db = new AWS.DynamoDB(config)

var sensorData = require("./sensorData")

var Generator = require("./generator")
var gen = new Generator

var server = (req, res) => {
  res.writeHead(200)
  res.end()
}

app.listen(8888);

//var count = 0

var putPhrase = (phrase, timestamp, cbk) => {
  console.log(JSON.stringify(phrase))
  let params = {
    Item: {
      timestamp: { N: timestamp },
      phrase: { S: JSON.stringify(phrase) }
    },
    TableName: "ff-voc-text"
  }

  db.putItem(params, cbk)
}

var prepInputs = (data) => {
  let timestamps = data[0].map(item => {
    return item.timestamp
  })

  let getVal = (sensor, timestamp) => {
    return data[sensor - 1].find(item => {
      return item.timestamp == timestamp
    }).value
  }

  return timestamps.map(timestamp => {
    return {
      timestamp: timestamp,
      values: [1, 2, 3, 4].map(sensor => {
        return getVal(sensor, timestamp)
      })
    }
  })
}

io.on("connection", socket => {
  setInterval(() => {
    sensorData().then(data => {
      let inputs = prepInputs(data)

      inputs.forEach(input => {
        let phrase = gen.generate(input.values)

        setTimeout(() => {
          putPhrase(phrase, input.timestamp, (err, data) => {
            if(err) console.log("ERR", err)
            else {
              console.log("SUCCESS", data)
              socket.emit("phrase", phrase)
            }
          })
        }, 400);
      });

      //inputs.forEach(input => {
      //  gen.generate(input).then(phrase => {
      //    console.log(phrase)
      //    socket.emit("phrase", phrase)
      //  }, err => {
      //    console.log("ERR", err)
      //  })
      //})
    }, err => {
      console.log("error", err)
    })
  }, INTERVAL_MS)
})
