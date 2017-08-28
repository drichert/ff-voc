var fs = require("fs")
var glob = require("glob")

class Generator {
  static scale(input, max) {
    return input / max
  }

  constructor() {
    // Using 10-bit ADC, so we'll divide by 1024 to scale to float fraction
    this.scale = 1024

    // Max wods in output phrase
    this.maxWords = 20

    this.texts = require("ff-voc-texts").sync()
  }

  loadTexts() {
    var texts = []

    let globPtn = __dirname + "/../share/*.txt"
    let paths = glob.sync(globPtn)

    paths.forEach((path) => {
      texts.push(fs.readFileSync(path, {
        encoding: "utf8"
      }).split(/(\s+)/))
    })

    this.texts = texts
  }

  generate(inputs) {
    if(inputs.length > 4) throw("Too many inputs (4 max)")

    var that = this

    inputs = inputs.map(input => {
      return input / that.scale
    })

    // Use input 3 (if present) to set index offset
    let offset = inputs[3] ? Math.round(inputs[3] * 100) : 0

    // Pick text based on input 0
    let textNdx = inputs[0] * that.scale + offset
    let text = that.texts[textNdx % that.texts.length]

    // Pick starting point based on input 1, and number of words
    // based on input 2
    let wordNdx = (Math.round(inputs[1] * text.length) + offset) % text.length
    let numWords = Math.round(inputs[2] * that.maxWords) + 5

    let words = text.slice(wordNdx, wordNdx + numWords + 1)
    let phrase = words.join("")

    return phrase
  }
}

module.exports = Generator
