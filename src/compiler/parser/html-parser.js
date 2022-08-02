// 标签名
var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"
// 标签名或带命名空间的标签名 div div:xxx
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"
// 开始标签 div 
var startTagOpen = new RegExp(("^<" + qnameCapture))
// 开始标签的闭合 > 或 />
var startTagClose = /^\s*(\/?)>/
// 结束标签 div
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"))
// 属性
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

const parseHTML = (html) => {
  const stack = []
  let root = null

  // while (html) {
  //   let textEnd = html.indexOf('<')

  //   if (textEnd === 0) {
  //     const match = parseStartTag(html)

  //     if (match) {
  //       start()
  //       continue
  //     }
  //   }
  // }

  const advance = (n) => {
    html = html.substring(n)
  }
  
  const parseStartTag = () => {
    const matched = html.match(startTagOpen)

    if(matched) {
      const match = {
        tagName: matched[1],
        attrs: []
      }

      advance(matched[0].length)

      let attr = null
      let end = null

      // 结束的地方肯定没有属性了，attr 为 false。要是 html.match(startTagClose)
      // 在后面不会执行。
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3]
        })

        advance(attr[0].length)
      }
  
      advance(end[0].length)

      return match
    }
  }

  const start = () => {

  }

  parseStartTag()
}

export default parseHTML