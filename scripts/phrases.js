const argv = require("yargs").argv

var Generator = require("./generator")

var generatorParams = argv.textsGlob ?
  { textsGlob: argv.textsGlob } :
  { textsModule: "ff-dk-texts" }

var g = new Generator(generatorParams)

var sensorData = [];

if(argv.data) {
  sensorData = require(argv.data)
} else {
  console.log("Missing --data (path to JSON data)")
  process.exit(1)
}

process.stderr.write("Sorting... ")
sensorData = sensorData.sort((a, b) => {
  return parseInt(a.timestamp) - parseInt(b.timestamp)
})
process.stderr.write("done.\n")

var timestamps = new Set(sensorData.map(s => s.timestamp))

timestamps.forEach(t => {
  let values = sensorData.filter(s => {
    return s.timestamp == t
  }).map(s => s.value)

  process.stdout.write(g.generate(values) + " ")
})
