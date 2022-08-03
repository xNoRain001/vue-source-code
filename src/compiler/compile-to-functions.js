import generate from "./codegen"
import parseHTML from "./parser/html-parser"

const compileToFunctions = template => {
  const ast = parseHTML(template)
  const code = generate(ast)
  
  return new Function(`with (this) { return ${ code } }`)
}

export default compileToFunctions