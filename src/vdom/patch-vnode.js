import createElm from './create-elm'
import updateChildren from './updateChildren'
import { each, isDef } from '../utils/index'

const patchVnode = (oldVnode, vnode) => {
  const elm = vnode.elm = oldVnode.elm

  // text
  if (oldVnode.text && oldVnode.text !== vnode.text) {
    elm.textContent = vnode.text
  }
  // element
  else {
    const oldCh = oldVnode.children
    const ch = vnode.children

    if (isDef(oldCh) && isDef(ch) && oldCh !== ch) {
      updateChildren(elm, oldCh, ch)
    }
    else if (isDef(oldCh)) {
      elm.innerHTML = ''
    }
    else if (isDef(ch)) {
      each(ch, (_, c) => {
        elm.appendChild(createElm(c))
      })
    }
  }
}

export default patchVnode