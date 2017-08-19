var moment = require("moment")
var AWS = require("aws-sdk")

var config = require("./config.json")
var db = new AWS.DynamoDB(config)

// options -
//   sensor: Sensor number (1-4)
var sensorData = (options) => {
  return new Promise((resolve, reject) => {
    let params = {
      ExpressionAttributeValues: {
        ":v1": { N: "" + options.sensor }
      },
      KeyConditionExpression: "sensor = :v1",
      TableName: "ff-tgs2602-voc"
    }

    db.query(params, (err, data) => {
      if(err) reject(err)
      else {
        let values = data.Items.map(item => {
          return item.value.N
        })

        resolve(values)
      }
    })
  })
}

module.exports = sensorData
