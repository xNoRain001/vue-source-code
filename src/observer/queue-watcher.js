import { each, nextTick } from "../utils"

let wathcerIds = new Set()
let queue = []
let waiting = false

const queueWatcher = watcher => {
  const { id } = watcher

  if (!wathcerIds.has(id)) {
    wathcerIds.add(id)
    queue.push(watcher)
  }

  if (!waiting) {
    nextTick(flushSchedulerQueue)
    waiting = true
  }
}

const flushSchedulerQueue = () => {
  each(queue, (_, watcher) => {
    watcher.run()
  })

  resetState()
}

const resetState = () => {
  wathcerIds = new Set()
  queue = []
  waiting = false
}


export default queueWatcher