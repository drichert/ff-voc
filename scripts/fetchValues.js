const TIMEOUT = process.env["TIMEOUT"] || 10000
const QUERY_LIMIT = 1000

const fs = require("fs")
const AWS = require("aws-sdk")
const config = require("./config.json")
const argv = require("yargs").argv

const timestamps = () => {
  if(!argv.day) {
    console.log("Missing --day")
    process.exit(1)
  } else var day = argv.day

  let d = new Date(day)

  d.setHours(0, 0, 0, 0)
  let start = d.valueOf()

  d.setHours(23, 59, 59, 999)
  let end = d.valueOf()

  return { start: start, end: end }
}

var db = new AWS.DynamoDB({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
})

var collection = [];

var queryValues = (sensor, startMs, endMs, startKey, cbk) => {
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
      "sensor = :sensor AND #T BETWEEN :startMs AND :endMs",
    Limit: QUERY_LIMIT
  }

  if(startKey) params.ExclusiveStartKey = startKey

  process.stderr.write("querying...\n")

  db.query(params, (err, data) => {
    setTimeout(() => {
      if(err) return cbk(err)
      else {
        data.Items.forEach(item => {
          collection.push({
            timestamp: item.timestamp.N,
            sensor: item.sensor.N,
            value: item.value.N
          })
        })

        if(data.LastEvaluatedKey) {
          process.stderr.write(
            "LastEvaluatedKey: " +
            JSON.stringify(data.LastEvaluatedKey)
            + "\n")

          return queryValues(sensor, startMs, endMs, data.LastEvaluatedKey)
        } else {
          return cbk(null, collection)
        }
      }
    }, TIMEOUT)
  })
}

var t = timestamps()

queryValues(1, t.start, t.end, null, (err, data) => {
  if(err) process.stderr.write("ERROR! " + err + "\n")
  else console.log(JSON.stringify(data))
})
