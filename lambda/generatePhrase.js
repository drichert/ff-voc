var AWS = require("aws-sdk")
var db = new AWS.DynamoDB

var Generator = require("./generator")
var gen = new Generator

//var fn = (event, context, cbk) => {
//  inputs = [99, 22, 77, 300]
//
//  phrase = gen.generate(inputs)
//  //console.log(phrase)
//
//  cbk(null, phrase)
//}

//module.exports = (event, context, cbk) => {
//  setTimeout(fn.bind(this, event, context, cbk), 1000)
//}

//exports.handler = (event, context, cbk) => {
module.exports = (event, context, cbk) => {
  //var getLatestPhraseTimestamp = () => {
  //  let params = {
  //    AttributesToGet: [ "timestamp" ],
  //    TableName: "phrase-test",
  //    Key: ""
  //  }

  //  db.query(params)
  //}

  //var putPhrase = (phrase, timestamp) => {
  //  let params = {
  //    Item: {
  //      type: { S: "phrase" },
  //      timestamp: { N: timstamp },
  //      phrase: { S: phrase }
  //    }
  //    TableName: "phrase-test"
  //  }

  //  return new Promise((resolve, reject) => {
  //    db.putItem(params, (err, data) => {
  //      if(err) reject(err)
  //      else resolve(data)
  //    })
  //  })
  //}

  var records = event.Records.map(r => {
    return r
  })

  //var timestamps = event.Records.map(r => {
  //  return r.dynamodb.Keys.timestamp.N
  //})

  //console.log("TIMESTAMPS", timestamps)
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
        if(err) reject(err)
        else {
          //console.log("GOT DATA", JSON.stringify(data))
          resolve(data.Items[0].value.N)
        }
      })
    })
  }

  //var generate = values => {
  //  gen.generate(inputs)
  //}

  Promise.all([1, 2, 3, 4].map(getVal)).then((values) => {
    console.log("GOT VALUES", values)

    let phrase = gen.generate(values)
    console.log("PHRASE", phrase)

    cbk(null, values)
  }, (err) => {
    console.log("ERR", err)
    cbk(err)
  })
};
