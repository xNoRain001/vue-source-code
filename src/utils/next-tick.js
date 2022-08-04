import each from "./each"

let callbacks = []
let pending = false

const timerFunc = function () {
  Promise.resolve().then(flushCallbacks)
}

const flushCallbacks = function () {
  each(callbacks, (_, cb) => {
    cb()
  })

  resetState()
}

const nextTick = cb => {
  callbacks.push(cb)

  if (!pending) {
    timerFunc()
    pending = true
  }
}

const resetState = () => {
  callbacks = []
  pending = true
}

export default nextTick