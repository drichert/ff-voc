const TIMEOUT = process.env["TIMEOUT"] || 4000
const QUERY_LIMIT = 10000

var fs = require("fs")
var moment = require("moment-timezone")
var AWS = require("aws-sdk")
var config = require("./config.json")

//GET ARGS
//var m = moment("2017-10-27 00:00")
//var start = m.startOf("day").valueOf()
//var end = m.endOf("day").valueOf()

var db = new AWS.DynamoDB({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
})

var collection = [];

var queryValues = (sensor, startMs, endMs, startKey = null) => {
  if([1, 2, 3, 4].indexOf(sensor) < 0) throw "Bad sensor number"

  let params = {
    TableName: "ff-tgs2602-voc",
    ExpressionAttributeNames: {
      "#T": "timestamp"
    },
    ExpressionAttributeValues: {
      ":sensor": { N: "" + sensor },
      ":startMs": { N: "" + startMs },
      ":endMs": { N: "" + endMs }
    },
    KeyConditionExpression:
      "sensor = :ssensor AND #T BETWEEN :startMs AND :endMs",
    Limit: QUERY_LIMIT
  }

  if(startKey) params.ExclusiveStartKey = startKey

  db.query(params, (err, data) => {
    setTimeout(() => {
      if(err) console.log(err, err.stack)
      else {
        data.Items.forEach(item => {
          collection.push({
            timestamp: item.timestamp.N,
            sensor: item.sensor.N,
            value: item.value.N
          })
        })

        if(data.LastEvaluatedKey) {
          //process.stderr.write(JSON.stringify(data.LastEvaluatedKey) + "\n")

          return queryValues(sensor, startMs, endMs, data.LastEvaluatedKey)
        } else {
          fs.writeFileSync("phrases.json", JSON.stringify(collection))
        }
      }
    }, TIMEOUT)
  })
}

queryValues().then(data => {
  console.log(data)
}, err => {
  console.log("ERROR! " + err)
})
