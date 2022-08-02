import initData from "./init-data"
import initMethods from "./init-methods"
import initWatch from "./init-watch"
import initComputed from "./init-computed"

const initState = (vm) => {
  const { data, methods, watch, computed } = vm.$options

  if (data) {
    initData(vm)
  }

  if (methods) {
    initMethods(vm)
  }

  if (watch) {
    initWatch(vm)
  }

  if (computed) {
    initComputed(vm)
  }
}

export default initState