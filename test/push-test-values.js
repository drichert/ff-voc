var AWS = require("aws-sdk")

var db = new AWS.DynamoDB(require("./config.json"))

//var params = (sensor, timestamp, vals = [21, 22, 23, 24]) => {
var params = (sensor, timestamp, value = 22) => {
  let valNdx = sensor - 1

  return {
    Item: {
      sensor: { N: "" + sensor },
      timestamp: { N: "" + timestamp },
      //value: { N: "" + vals[valNdx] }
      value: { N: "" + value }
    },
    TableName: "sensor-test-3"
  }
}

setInterval(() => {
  let timestamp = +new Date
  let sensors = [1, 2, 3, 4]

  // Randomize test values
  let values = [1, 2, 3, 4].map(n => {
    //return Math.floor(Math.random() * 1024)
    return Math.floor(Math.random() * 10) + 20
  })

  console.log("TIMESTAMP", timestamp)
  console.log("VALUES", values)

  sensors.forEach((n, i) => {
    db.putItem(params(n, timestamp, values[i]), (err, data) => {
      if(err) console.log("ERR", err)
      else console.log("SUCCESS")
    })
  })
}, 3000)
