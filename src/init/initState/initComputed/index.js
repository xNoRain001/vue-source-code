import Watcher from '../../../observer/watcher'
import defineComputed from './define-computed'
import { each, isFunction, noop } from '../../../utils'

const computedWatcherOptions = { lazy: true }

const initComputed = (vm) => {
  const watchers = vm._computedWatchers = Object.create(null)

  const { computed } = vm.$options

  each(computed, (key, userDef) => {
    const getter = isFunction(userDef)
      ? userDef
      : userDef.getter

    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions )
    
    defineComputed(vm, key, userDef)
  })
}

export default initComputed