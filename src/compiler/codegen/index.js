import { each } from '../../utils/index'

const generate = ast => {
  const { tag, attrs, children } = ast
  let data = ''
  let childrenCode = ''

  if (attrs) {
    data = genProps(attrs)
  }

  if (children.length) {
    childrenCode = genChildren(children)
  }

  if (data && childrenCode) {
    return `_c("${ tag }",${ data },${ childrenCode })`
  }
  else if (data) {
    return `_c("${ tag }",${ data })`
  }
  else if (childrenCode) {
    return `_c("${ tag }",${ childrenCode })`
  }
  else {
    return `_c("${ tag }")`
  }
}

const genProps = attrs => {
  let staticStyle = ''
  let staticAttrs = ''

  each(attrs, (_, prop) => {
    const { name, value } = prop

    if (name === 'style') {
      value.replace(/\s*([^;:]+)\:\s*([^;:]+)/g, (_, $1, $2) => {
        staticStyle += `"${ $1 }":"${ $2 }",`
      })
    } else {
      staticAttrs += `"${ name }":"${ value }",`
    }
  })

  staticStyle = staticStyle.slice(0, -1)
  staticAttrs = staticAttrs.slice(0, -1)

  if (staticStyle && staticAttrs) {
    return `{attrs:{${ staticAttrs }},staticStyle:{${ staticStyle }}}`
  }
  else if (staticStyle) {
    return `{staticStyle:{${ staticStyle }}}`
  }
  else {
    return `{attrs:{${ staticAttrs }}}`
  }
}

const genChildren = children => {
  let childrenCode = ''

  each(children, (_, child) => {
    childrenCode += `${ genNode(child) },`
  })

  return `[${ childrenCode.slice(0, -1) }]`
}

const genNode = ast => {
  if (ast.type === 1) {
    return genElement(ast)
  } else {
    return genText(ast)
  }
}

const genElement = ast => {
  return generate(ast)
}

// {{}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
const genText = ast => {
  let { text } = ast

  if (!defaultTagRE.test(text)) {
    return `_v(${ text })`
  }

  defaultTagRE.lastIndex = 0

  const token = []
  let lastIndex = 0
  let index = 0
  let matched = null
  let tokenVal = null

  while (matched = defaultTagRE.exec(text)) {
    index = matched.index // {
    tokenVal = text.slice(lastIndex, index)

    if (tokenVal) {
      token.push(JSON.stringify(tokenVal))
    }

    tokenVal = matched[1].trim()

    if (tokenVal) {
      token.push(`_s(${ tokenVal })`)
    }

    lastIndex = index + matched[0].length
  }

  if (lastIndex < text.length) {
    token.push(JSON.stringify(text.slice(lastIndex)))
  }

  return `_v(${ token.join('+') })`
}

export default generate