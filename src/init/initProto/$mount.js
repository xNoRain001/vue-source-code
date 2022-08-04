import Watcher from '../../observer/watcher'
import compileToFunctions from '../../compiler/index'
import { noop } from '../../utils'

const $mount = function (el) {
  const vm = this
  vm.$el = el = document.querySelector(el)
  const template = el.outerHTML
  // HTML => render
  const render = compileToFunctions(template)
  vm.$options.render = render

  mountComponent(vm)
}

const mountComponent = (vm) => {
  const updateComponent = () => {
    vm._update(vm._render())
  }

  new Watcher(vm, updateComponent, noop)
}

export default $mount