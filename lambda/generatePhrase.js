var AWS = require("aws-sdk")
var db = new AWS.DynamoDB

var Generator = require("./generator")
var gen = new Generator

var fn = (event, context, cbk) => {
  inputs = [99, 22, 77, 300]

  phrase = gen.generate(inputs)
  console.log(phrase)

  cbk(null, phrase)
}

module.exports = (event, context, cbk) => {
  setTimeout(fn.bind(this, event, context, cbk), 1000)
}
