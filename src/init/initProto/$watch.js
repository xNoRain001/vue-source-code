import Watcher from '../../observer/watcher'

const $watch = function (expOrFn, handler, options) {
  const vm = this

  options.user = true

  const { value } = new Watcher(vm, expOrFn, handler, options)

  if (options.immediate) {
    handler.call(vm, value)
  }
}

export default $watch