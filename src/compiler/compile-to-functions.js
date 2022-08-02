import parseHTML from "./parser/html-parser"

const compileToFunctions = template => {
  parseHTML(template)
}

export default compileToFunctions