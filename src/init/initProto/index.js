import initState from '../initState'
import compileToFunctions from '../../compiler'
import { isObject } from '../../utils'
import { patch, createTextVnode, createElementVnode } from '../../vdom'

const initProto = Vue => {
  Vue.prototype._init = function () {
    const vm = this
    const { el } = vm.$options

    initState(vm)

    if (el) {
      this.$mount(el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    vm.$el = el = document.querySelector(el)
    const template = el.outerHTML
    // HTML => render
    const render = compileToFunctions(template)
    vm.$options.render = render

    mountComponent(vm)
  }

  const mountComponent = (vm) => {
    vm._update(vm._render())
  }

  Vue.prototype._update = function (vnode) {
    const vm = this
    const prevVnode = vm._vnode

    vm._vnode = vnode

    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode)
    } else {
      vm.$el = patch(prevVnode, vnode)
    }
  }

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

export default initProto