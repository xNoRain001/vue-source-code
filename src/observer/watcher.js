import parsePath from "./parse-path"
import queueWatcher from "./queue-watcher"
import { isFunction } from "../utils"
import { popTarget, pushTarget } from "./handle-target"

let id = 1

class Watcher {
  constructor (vm, expOrFn, cb, options) {
    if (options) {
      this.user = options.user
    } else {
      this.user = false
    }

    this.id = id++
    this.vm = vm
    this.cb = cb // user watcher's handler
    this.deps = []
    this.depIds = new Set()

    if (isFunction(expOrFn)) {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }

    this.value = this.get()
  }

  get () {
    pushTarget(this)
    const value = this.getter(this.vm)
    popTarget()

    return value
  }

  update () {
    queueWatcher(this)
  }

  run () {
    console.log('#')
    const oldVal = this.value
    const newVal = this.value = this.get()

    if (this.user) {
      this.cb.call(vm, newVal, oldVal)
    }
  }

  addDep (dep) {
    const { id } = dep
    if (!this.depIds.has(id)) {
      this.deps.push(dep)
      this.depIds.add(id)
      dep.addSub(this)
    }
  }
}

export default Watcher