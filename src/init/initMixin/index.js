import compileToFunctions from "../../compiler/compile-to-functions"
import initState from "../initState"

const initMixin = (Vue) => {
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
}

export default initMixin