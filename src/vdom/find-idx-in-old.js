import sameVnode from "./same-vnode"
import { isDef } from "../utils"

const findIdxInOld = (ch, startIdx, endIdx, vnode) => {
  for (let i = startIdx; i <= endIdx; i++) {
    const c = ch[i]

    if (isDef(c) && sameVnode(c, vnode)) {
      return i
    }
  }
}

export default findIdxInOld