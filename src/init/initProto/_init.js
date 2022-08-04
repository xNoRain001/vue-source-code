import initState from '../initState'

const _init = function () {
  const vm = this
  const { el } = vm.$options

  initState(vm)

  if (el) {
    this.$mount(el)
  }
}

export default _init