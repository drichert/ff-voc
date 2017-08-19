var Generator = require("./generator")

var gen = new Generator

var randomInputs = num => {
  let out = []

  // min inclusive, max exclusive
  let randInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
  }

  for(var i = 0; i < num; i++) {
    out.push([ 
      randInt(16, 25),
      randInt(16, 25),
      randInt(16, 25),
      randInt(16, 25) 
    ])
  }
  
  return out
}

randomInputs(100).forEach((inputs) => {
  gen.generate(inputs).then((data) => {
    process.stdout.write(data)
  }, console.log)
})
