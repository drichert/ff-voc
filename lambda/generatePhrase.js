var WebSocket = require("ws")

var AWS = require("aws-sdk")
var db = new AWS.DynamoDB

var Generator = require("./generator")
var gen = new Generator

var config = require("./config.json")

module.exports = (event, context, cbk) => {
  var broadcastPhrase = phrase => {
    let sock = new WebSocket("wss://ff.unfo.info/phrases/")

    sock.on("open", () => {
      sock.send(config.secret + "::::" + phrase)
      sock.close()
    })
  }

  var putPhrase = (phrase) => {
    let params = {
      Item: {
        type: { S: "phrase" },
        timestamp: { N: timestamp },
        phrase: { S: phrase }
      },
      TableName: "phrase-test"
    }

    return new Promise((resolve, reject) => {
      db.putItem(params, (err, data) => {
        if(err) reject(err)
        else resolve(phrase)
      })
    })
  }

  var timestamp = event.Records[0].dynamodb.Keys.timestamp.N

  var getVal = (sensor) => {
    let params = {
      ExpressionAttributeNames: {
        "#T": "timestamp"
      },
      ExpressionAttributeValues: {
        ":sensor": { N: "" + sensor },
        ":ms": { N: "" + timestamp }
      },
      KeyConditionExpression: "sensor = :sensor AND #T = :ms",
      TableName: "sensor-test-3",
      ScanIndexForward: false,
      Limit: 1
    }

    return new Promise((resolve, reject) => {
      db.query(params, (err, data) => {
        //console.log("SENSOR, DATA, ERR", sensor, JSON.stringify(data), JSON.stringify(err))
        if(err) return reject(err)
        else {
          let val = data.Items[0]
          val = val ? val.value.N : 0

          return resolve(val)
        }
      })
    })
  }

  var applyOffset = (values, offset) => {
    return values.map(v => {
      return parseInt(v) + offset
    })
  }

  return Promise.all([1, 2, 3, 4].map(getVal)).then(values => {
    console.log("GOT VALUES", values)

    values = applyOffset(values, 1000)
    console.log("OFFSET VALUES", values)

    let phrase = gen.generate(values)
    console.log("PHRASE", phrase)

    putPhrase(phrase).then(phrase => {
      broadcastPhrase(phrase)

      console.log("PUT PHRASE", phrase)
      cbk(null, phrase)
    }, err => {
      console.log("ERROR", err)
      cbk(err)
    })
  })
};
