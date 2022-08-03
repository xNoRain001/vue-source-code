import parseHTML from "./parser/html-parser"

const compileToFunctions = template => {
  const ast = parseHTML(template)
}

export default compileToFunctions