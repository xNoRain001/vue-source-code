import genNode from "./genNode"
import { each } from "../../utils"

const genChildren = children => {
  let childrenCode = ''

  each(children, (_, child) => {
    childrenCode += `${ genNode(child) },`
  })

  return `[${ childrenCode.slice(0, -1) }]`
}

export default genChildren