import genElement from './genElement'
import genText from "./genText"

const genNode = ast => {
  if (ast.type === 1) {
    return genElement(ast)
  } else {
    return genText(ast)
  }
}

export default genNode