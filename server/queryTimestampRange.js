var AWS = require("aws-sdk")

var config = require("./config.json")
console.log(config)
var db = new AWS.DynamoDB(config)

// sensor - sensor number (1-4)
// startTime - timestamp (seconds)
// endTime - timestamp (seconds)
var sensorData = (sensor, startTime, endTime) => {
  //console.log("start", startTime, "end", endTime)
  let results = []

  var query = (lastEvaluatedKey, cbk) => {
    if(typeof(arguments[0]) === "function") {
      lastEvaluatedKey = null
      cbk = arguments[0]
    }

    let params = {
      ExpressionAttributeNames: {
        "#T": "timestamp"
      },
      ExpressionAttributeValues: {
        ":sensor": { N: "" + sensor },
        ":start_ms": { N: "" + startTime * 1000 },
        ":end_ms": { N: "" + endTime * 1000 }
      },
      KeyConditionExpression:
        "sensor = :sensor AND #T BETWEEN :start_ms AND :end_ms",
      TableName: "ff-tgs2602-voc"
    }

    if(lastEvaluatedKey && typeof(lastEvaluatedKey) !== "function") {
      console.log(lastEvaluatedKey)
      params.ExclusiveStartKey = lastEvaluatedKey
    }

    db.query(params, (err, data) => {
      console.log(err)
      let values = data.Items.map(item => {
        return {
          sensor: item.sensor.N,
          timestamp: item.timestamp.N,
          value: item.value.N
        }
      })

      results.concat(values)

      if(data.LastEvaluatedKey) {
        query(data.LastEvaluatedKey, cbk)
      } else {
        cbk(err, results)
      }
    })
  }

  return new Promise((resolve, reject) => {
    query((err, results) => {
      if(err) reject(err)
      else resolve(results)
    })
  })
}

module.exports = sensorData
