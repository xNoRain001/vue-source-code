const proxy = (vm, soureKey, key) => {
  Object.defineProperty(vm, key, {
    get () {
      // 保证总是获取到最新的
      return vm[soureKey][key]
    },

    set (newVal) {
      vm[soureKey][key] = newVal
    }
  })
}

export default proxy