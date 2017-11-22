const TIMEOUT = process.env["TIMEOUT"] || 5000
const QUERY_LIMIT = 2000

const fs = require("fs")
const async = require("async")
const AWS = require("aws-sdk")
const config = require("./config.json")
const argv = require("yargs").argv

// stderr logger
const _e = msg => process.stderr.write(`${msg}\n`)

const timestamps = () => {
  var day;

  // --day YYYY-MM-DD
  if(!argv.day) {
    console.log("Missing --day")
    process.exit(1)
  } else day = argv.day

  let d = new Date(day)

  d.setHours(0, 0, 0, 0)
  let start = d.valueOf()

  d.setHours(23, 59, 59, 999)
  let end = d.valueOf()

  return { start: start, end: end }
}

// --json-path /path/to/output.json
var jsonPath = argv.jsonPath
_e(`Output JSON path: ${jsonPath}`)

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

  _e("querying...")

  return db.query(params, (err, data) => {
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

        _e(`collection size: ${collection.length}`)

        if(data.LastEvaluatedKey) {
          let lastKey = data.LastEvaluatedKey

          _e(`LastEvaluatedKey: ${JSON.stringify(lastKey)}`)

          return queryValues(sensor, startMs, endMs, lastKey, cbk)
        } else {
          _e(`Finished fetching values for sensor ${sensor}`)

          return cbk(null, collection)
        }
      }
    }, TIMEOUT)
  })
}

var t = timestamps()

async.concatSeries([1, 2, 3, 4], (sensor, cbk) => {
  queryValues(sensor, t.start, t.end, null, (err, data) => {
    if(err) return cbk(err)
    else return cbk(null, data)
  })
}, (err, data) => {
  if(err) return _e(`ERROR: ${err}`)
  else {
    var json = JSON.stringify(data)

    if(jsonPath) return fs.writeFileSync(jsonPath, json)
    else return console.log(json)
  }
})
