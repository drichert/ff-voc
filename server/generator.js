var fs = require("fs");
var glob = require("glob")
var AWS = require("aws-sdk")

class Generator {
  static scale(input, max) {
    return input / max
  }

  constructor() {
    // Using 10-bit ADC, so we'll divide by 1024 to scale to float fraction
    this.scale = 1024

    // Max wods in output phrase
    this.maxWords = 10

    this.loadTexts()
  }

  loadTexts() {
    var texts = []

    let globPtn = __dirname + "/../share/*.txt"
    let paths = glob.sync(globPtn)

    paths.forEach((path, i) => {
      texts[i] = fs.readFileSync(path, {
        encoding: "utf8"
      }).split(/(\s+)/)
    })

    this.texts = texts
  }

  generate(inputs) {
    if(inputs.length > 4) throw("Too many inputs (4 max)")

    var that = this

    return new Promise((resolve, reject) => {
      var err = null

      inputs = inputs.map(input => {
        return input / that.scale
      })

      // Pick text based on input 0
      let textNdx = inputs[0] * that.scale
      let text = that.texts[textNdx % that.texts.length]

      // Pick starting point based on input 1, and number of words
      // based on input 2
      let wordNdx = Math.round(inputs[1] * text.length)
      let numWords = Math.round(inputs[2] * that.maxWords)
      //console.log(wordNdx, numWords, inputs[2], that.maxWords)

      let words = text.slice(wordNdx, wordNdx + numWords + 1)
      let phrase = words.join("")

      if(err) reject(err)
      else resolve(phrase)
    })
  }
}

module.exports = Generator

//module.exports = (cbk) => {
//  var texts = []
//
//  let globPtn = __dirname + "/../share/*.txt"
//
//  glob(globPtn, (err, files) => {
//    files.forEach((f, i) => {
//      fs.readFile(f, (err, data) => {
//        if(err) console.log(err)
//        else {
//          // Preserve whitespace chunks
//          texts[i] = data.toString().split(/(\s+)/)
//        }
//      })
//    })
//  })
//
//  let err = null
//
//  if(cbk) cbk(err, data)
//}
