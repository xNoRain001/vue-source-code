// {{}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
const genText = ast => {
  let { text } = ast

  if (!defaultTagRE.test(text)) {
    return `_v(${ JSON.stringify(text) })`
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

export default genText