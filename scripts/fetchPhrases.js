var fs = require("fs")
var AWS = require("aws-sdk")
var config = require("./config.json")

var db = new AWS.DynamoDB({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
})

var collection = [];

var queryPhrases = (startKey = null) => {
  let params = {
    TableName: config.table,
    ExpressionAttributeNames: {
      "#T": "type"
    },
    ExpressionAttributeValues: {
      ":t": { S: "phrase" }
    },
    KeyConditionExpression: "#T = :t",
    Limit: 1000
  }

  if(startKey && startKey ) {
    params.ExclusiveStartKey = startKey
  }

  db.query(params, (err, data) => {
    setTimeout(() => {
      if(err) console.log(err, err.stack)
      else {
        data.Items.forEach(item => {
          let phrase = item.phrase.S

          collection.push({
            phrase: phrase,
            timestamp: item.timestamp.N
          })

          process.stdout.write(phrase + " ")
        })

        if(data.LastEvaluatedKey) {
          //process.stderr.write(JSON.stringify(data.LastEvaluatedKey) + "\n")

          return queryPhrases(data.LastEvaluatedKey)
        } else {
          fs.writeFileSync("phrases.json", JSON.stringify(collection))
        }
      }
    }, 3000)
  })
}

queryPhrases()
