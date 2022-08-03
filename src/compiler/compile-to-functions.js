import generate from "./codegen"
import parseHTML from "./parser/html-parser"

const compileToFunctions = template => {
  const ast = parseHTML(template)
  const render = generate(ast)
}

export default compileToFunctions