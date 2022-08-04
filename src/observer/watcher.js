import traverse from "./tarverse"
import parsePath from "./parse-path"
import queueWatcher from "./queue-watcher"
import { each, isFunction } from "../utils"
import { popTarget, pushTarget } from "./handle-target"

let id = 1

class Watcher {
  constructor (vm, expOrFn, cb, options) {
    if (options) {
      this.user = !!options.user
      this.sync = !!options.sync
      this.deep = !!options.deep
      this.lazy = !!options.lazy
    } else {
      this.user = this.sync = this.depp = this.lazy = false
    }

    this.id = id++
    this.vm = vm
    this.cb = cb // user watcher's handler
    this.dirty = this.lazy // for computed watcher
    this.deps = []
    this.depIds = new Set()

    if (isFunction(expOrFn)) {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }

    this.value = this.lazy
      ? undefined
      : this.get()
  }

  get () {
    pushTarget(this)

    const { vm } = this
    const value = this.getter.call(vm, vm)

    if (this.deep) {
      traverse(value)
    }

    popTarget()

    return value
  }

  update () {
    if (this.sync) {
      this.run()
    }
    else if (this.lazy)  {
      this.dirty = true
    }
    else {
      queueWatcher(this)
    }
  }

  run () {
    const oldVal = this.value
    const newVal = this.value = this.get()

    if (this.user) {
      this.cb.call(vm, newVal, oldVal)
    }
  }

  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  addDep (dep) {
    const { id } = dep
    if (!this.depIds.has(id)) {
      this.deps.push(dep)
      this.depIds.add(id)
      dep.addSub(this)
    }
  }

  depend () {
    each(this.deps, (_, dep) => {
      dep.depend()
    })
  }
}

export default Watcher