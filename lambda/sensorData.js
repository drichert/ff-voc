var sensorData = () => {
  var sensors = [1, 2, 3, 4]

  var promises = sensors.map(sensor => {
    let params = {
      ExpressionAttributeNames: {
        "#T": "timestamp"
      },
      ExpressionAttributeValues: {
        ":sensor": { N: "" + sensor },
        ":ms": { N: "" + time.unix() * 1000 }
      },
      KeyConditionExpression: "sensor = :sensor AND #T <= :ms",
      TableName: "ff-tgs2602-voc",
      ScanIndexForward: false,
      Limit: 500
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
