import { popTarget, pushTarget } from "./handle-target"

let id = 1

class Watcher {
  constructor (vm, expOrFn, cb, options) {
    this.id = id++
    this.vm = vm
    this.cb = cb
    this.deps = []
    this.depIds = new Set()
    this.getter = expOrFn

    this.get()
  }

  get () {
    pushTarget(this)
    this.getter()
    popTarget()
  }

  update () {
    this.get()
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