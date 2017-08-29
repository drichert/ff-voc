var AWS = require("aws-sdk")
var db = new AWS.DynamoDB

var Generator = require("./generator")
var gen = new Generator

module.exports = (event, context, cbk) => {
  //var getLatestPhraseTimestamp = () => {
  //  let params = {
  //    AttributesToGet: [ "timestamp" ],
  //    TableName: "phrase-test",
  //    Key: ""
  //  }

  //  db.query(params)
  //}

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
        if(err) reject(err)
        else {
          resolve(data.Items[0].value.N)
        }
      })
    })
  }

  Promise.all([1, 2, 3, 4].map(getVal)).then(values => {
    console.log("GOT VALUES", values)

    let phrase = gen.generate(values)
    console.log("PHRASE", phrase)

    putPhrase(phrase).then((phrase) => {
      console.log("PUT PHRASE", phrase)
      cbk(null, phrase)
    }, err => {
      console.log("ERROR", err)
      cbk(err)
    })
  })
};
