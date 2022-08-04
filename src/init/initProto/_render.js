const _render = function () {
  const vm = this
  const { render } = vm.$options

  return render.call(vm) // Vnode
}

export default _render