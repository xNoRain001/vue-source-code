import createText from './create-text'
import createElement from './create-element'
import { each, isDef } from "../utils"

const createElm = vnode => {
  const { tag, text, data, children } = vnode
  let elm = null

  if (isDef(tag)) {
    // element
    elm = vnode.elm = createElement(tag)
    each(children, (_, child) => {
      elm.appendChild(createElm(child))
    })
  } else {
    // text
    elm = vnode.elm = createText(text)
  }

  return elm
}

export default createElm