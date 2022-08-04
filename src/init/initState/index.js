import initData from "./initData"
import initMethods from "./initMethods"
import initWatch from "./initWatch"
import initComputed from "./initComputed"

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