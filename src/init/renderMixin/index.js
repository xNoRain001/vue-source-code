import { isObject } from "../../utils"
import { createTextVnode, createElementVnode } from "../../vdom"

const renderMix = Vue => {
  Vue.prototype._render = function () {
    const vm = this
    const { render } = vm.$options

    return render.call(vm) // Vnode
  }

  Vue.prototype._c = (tag, data, children) => {
    return createElementVnode(tag, data, children)
  }

  Vue.prototype._v = text => {
    return createTextVnode(text)
  }

  Vue.prototype._s = val => {
    return isObject(val)
      ? JSON.stringify(val)
      : val
  }
}

export default renderMix