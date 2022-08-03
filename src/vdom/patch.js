import { isDef, isUndef } from "../utils"
import createElm from "./create-elm"

const patch = (oldVnode, vnode) => {
  if (isUndef(oldVnode)) {
    // render component

    return
  }

  if (isDef(oldVnode.nodeType)) {
    // init render
    const elm = createElm(vnode)
    const body = oldVnode.parentNode

    body.insertBefore(elm, oldVnode.nextSibling)
    body.removeChild(oldVnode)
    
    return elm
  }
}

export default patch