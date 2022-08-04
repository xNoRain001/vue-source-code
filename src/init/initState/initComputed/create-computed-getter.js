import Dep from "../../../observer/dep"

const createComputedGetter = function (key) {
  return function () {
    const vm = this
    const watcher = vm._computedWatchers[key]

    if (watcher.dirty) {
      watcher.evaluate()
    }

    if (Dep.target) {
      watcher.depend()
    }

    return watcher.value
  }
}

export default createComputedGetter