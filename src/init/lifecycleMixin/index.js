import patch from "../../vdom/patch"

const lifecycleMixin = Vue => {
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
}

export default lifecycleMixin