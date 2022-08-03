// 标签名
const ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"
// 标签名或带命名空间的标签名 div div:xxx
const qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"
// 开始标签 div 
const startTagOpen = new RegExp(("^<" + qnameCapture))
// 开始标签的闭合 > 或 />
const startTagClose = /^\s*(\/?)>/
// 结束标签 div
const endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"))
// 属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

const parseHTML = html => {
  const advance = n => {
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

      // 结束的地方肯定没有属性了，attr 为 false，要是 html.match(startTagClose)
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

  const start = match => {
    const ast = createASTElement(match)

    if (!root) {
      root = ast
      stack.push(ast)
    } else {
      parent = stack[stack.length - 1]
      ast.parent = parent
      parent.children.push(ast)
      stack.push(ast)
    }
  }

  const end = () => {
    stack.pop()
  }

  const chars = text => {
    text = text.trim()
    
    if (text) {
      parent = stack[stack.length - 1]
      parent.children.push({
        type: 3,
        text: text
      })
    }
  }

  const createASTElement = match => {
    return {
      type: 1,
      tag: match.tagName,
      attrs: match.attrs,
      children: [],
      parent: undefined
    }
  }

  const stack = []
  let root = null

  while (html) {
    let textEnd = html.indexOf('<')

    if (textEnd === 0) {
      const startMatched = parseStartTag(html)

      if (startMatched) {
        start(startMatched)
        continue
      }

      const endMatched = html.match(endTag)

      if (endMatched) {
        end()
        advance(endMatched[0].length)
        continue
      }
    }

    if (textEnd > 0) {
      const text = html.slice(0, textEnd)
      chars(text)
      advance(textEnd)
    }
  }

  return root
}

export default parseHTML