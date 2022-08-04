const initMethods = (vm) => {
  const { methods } = vm.$options

  for (const method in methods) {
    vm[method] = methods[method].bind(vm)
  }
}

export default initMethods