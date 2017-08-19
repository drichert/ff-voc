var sensorData = require("./sensorData")

var promises = [1, 2, 3, 4].map(n => {
  return sensorData({ sensor: n })
})

Promise.all(promises).then(data => {
  console.log(data[0].length)
  console.log(data[1].length)
  console.log(data[2].length)
  console.log(data[3].length)
})
