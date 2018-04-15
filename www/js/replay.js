class TextLoader {
  constructor() {
    this.phrases = []
    this.textNumMax = 181
    this.numDisplayPhrases = 20
    this.waitTime = 30 * 1000
  }

  fetchText(cbk) {
    var xhr = new XMLHttpRequest()
    var that = this

    console.log(this.textPath())

    xhr.open("GET", this.textPath())
    xhr.send(null)

    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        let phrases = xhr.responseText.split("\n")

        // Trim timestamp info header
        phrases = phrases.slice(3)

        that.phrases = phrases

        that.next(cbk)
      }
    }
  }

  textPath() {
    let num = ("" + this.textNum).padStart(4, 0)

    return "/text/ug0914-1111_" + num + ".txt"
  }

  next(cbk) {
    if(this.phrases.length) {
      this.text = this.phrases
        .slice(0, this.numDisplayPhrases)
        .join("<br>")

      this.prepareText()

      this.phrases = this.phrases.slice(this.numDisplayPhrases)
      console.log(this.phrases.length)

      if(cbk) cbk(null, this.text)
    } else {
      if(this.textNum < this.textNumMax) this.textNum++
      else this.textNum = 0

      this.fetchText(cbk)
    }
  }

  prepareText() {
    this.text = this.text
      .replace(/  /g, " &nbsp;")
      //.replace("\n", "<br>")
      .replace("\t", "&nbsp;&nbsp;&nbsp;&nbps;&nbsp;")
  }

  run(cbk) {
    this.intervalId = setInterval(this.next.bind(this, cbk), this.waitTime)
  }
}
