import { each } from "../../utils"

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

export default genProps