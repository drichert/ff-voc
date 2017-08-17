var fs = require("fs");
var glob = require("glob")
var AWS = require("aws-sdk")

class Generator {
  static scale(input, max) {
    return input / max
  }

  constructor() {
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

  set inputs(vals) {
    this._inputs = vals
    this._output = this.generate()
  }

  get output {
    return this._output
  }

  get textsIndex() {

  }

  scaleInputs() {
    var that = this

    this._inputs.map(input => {
      return input / that.scale
    })
  }

  //generate() {
  //  return
  //}
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
