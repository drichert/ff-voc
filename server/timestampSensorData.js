var moment = require("moment")
var AWS = require("aws-sdk")

var config = require("./config.json")
var db = new AWS.DynamoDB(config)

// time - max timestamp in seconds. Fetches newest data based
//  on this value
var sensorData = (time = null) => {
  // Default to now, multiple by 1000 to get ms timestamp
  // format used in database
  if(!time) time = +new Date * 1000

  var sensors = [1, 2, 3, 4]

  var promises = sensors.map(sensor => {
    let params = {
      ExpressionAttributeNames: {
        "#T": "timestamp"
      },
      ExpressionAttributeValues: {
        ":sensor": { N: "" + sensor },
        ":ms": { N: "" + time }
      },
      KeyConditionExpression: "sensor = :sensor AND #T <= :ms",
      TableName: "ff-tgs2602-voc",
      ScanIndexForward: false,
      Limit: 100
    }

    return new Promise((resolve, reject) => {
      db.query(params, (err, data) => {
        if(err) reject(err)
        else {
          let values = data.Items.map(item => {
            return {
              sensor: item.sensor.N,
              timestamp: item.timestamp.N,
              value: item.value.N
            }
          })

          resolve(values)
        }
      })
    })
  })

  return Promise.all(promises)
}

module.exports = sensorData
