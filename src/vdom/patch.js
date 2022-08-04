import createElm from "./create-elm"
import sameVnode from "./same-vnode"
import patchVnode from "./patch-vnode"
import { isDef, isUndef } from "../utils"

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
  } else if (sameVnode(oldVnode, vnode)) {
    // diff
    patchVnode(oldVnode, vnode)
  }
}

export default patch