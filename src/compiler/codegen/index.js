import genProps from './genProps'
import genChildren from './genChildren'

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

export default generate