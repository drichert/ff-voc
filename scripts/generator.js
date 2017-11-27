var fs = require("fs")
var glob = require("glob")

class Generator {
  static scale(input, max) {
    return input / max
  }

  constructor(options) {
    this.options = Object.assign({
      textsModule: null,
      textsGlob: null
    }, options)

    // Using 10-bit ADC, so we'll divide by 1024 to scale to float fraction
    this.scale = 1024

    // Max wods in output phrase
    this.maxWords = 20

    this.texts = options.textsModule ?
      require(this.options.textsModule).sync() :
      this.loadTexts()
  }

  loadTexts() {
    if(!this.options.textsGlob) throw "Missing --textsGlob"

    return glob.sync(this.options.textsGlob).map(path => {
      return fs.readFileSync(path, { encoding: "utf8" })
        .toString()
        .split(/(\s+)/)
    })
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
    let textNdx = inputs[0] * this.scale + offset
    let text = this.texts[textNdx % this.texts.length]

    // Pick starting point based on input 1, and number of words
    // based on input 2
    let wordNdx = (Math.round(inputs[1] * text.length) + offset) % text.length
    let numWords = Math.round(inputs[2] * this.maxWords) + 5

    let words = text.slice(wordNdx, wordNdx + numWords + 1)
    let phrase = words.join("")

    return phrase
  }
}

module.exports = Generator
