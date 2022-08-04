import { each } from "../utils"

let id = 1

class Dep {
  constructor () {
    this.id = id++
    this.subs = []
  }

  addSub (watcher) {
    this.subs.push(watcher)
  }

  depend () {
    Dep.target.addDep(this)
  }

  notify () {
    each(this.subs, (_, watcher) => {
      watcher.update()
    })
  }
}

export default Dep