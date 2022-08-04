import { patch } from '../../vdom'

const _update = function (vnode) {
  const vm = this
  const prevVnode = vm._vnode

  vm._vnode = vnode
  vm.$el = patch(vm.$el, vnode)

  // if (!prevVnode) {
  //   vm.$el = patch(vm.$el, vnode)
  // } else {
  //   vm.$el = patch(prevVnode, vnode)
  // }
}

export default _update