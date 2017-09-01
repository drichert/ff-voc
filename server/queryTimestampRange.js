var AWS = require("aws-sdk")

var config = require("./config.json")
var db = new AWS.DynamoDB(config)

// sensor - sensor number (1-4)
// startTime - timestamp (seconds)
// endTime - timestamp (seconds)
var sensorData = (sensor, startTime, endTime) => {
  let results = []

  var query = (lastEvaluatedKey, cbk) => {
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

    if(lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey
    }

    db.query(params, (err, data) => {
      setTimeout(()=>{}, 333)

      let values = data.Items.map(item => {
        return {
          sensor: item.sensor.N,
          timestamp: item.timestamp.N,
          value: item.value.N
        }
      })

      results = results.concat(values)

      if(data.LastEvaluatedKey) {
        query(data.LastEvaluatedKey, cbk)
      } else {
        return cbk(err, results)
      }
    })
  }

  return new Promise((resolve, reject) => {
    query(null, (err, results) => {
      if(err) reject(err)
      else resolve(results)
    })
  })
}

module.exports = sensorData
