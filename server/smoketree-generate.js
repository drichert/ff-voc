var Generator = require("./generator")
var sensorData = require("./sensorData")
var _ = require("underscore")

// TODO: Add date/time range

var promises = [1, 2, 3, 4].map(n => {
  return sensorData({ sensor: n })
})

var gen = new Generator

Promise.all(promises).then(inputs => {
  inputs = _.zip(inputs[0], inputs[1], inputs[2], inputs[3])
  
  inputs.forEach(inputVals => {
    gen.generate(inputVals).then(phrase => {
      process.stdout.write(phrase)
    }, console.log)
  })
})
