var fs = require("fs")
var AWS = require("aws-sdk")
var config = require("./config.json")

var db = new AWS.DynamoDB({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
})

var collection = [];

