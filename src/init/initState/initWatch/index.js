import createWatcher from './create-watcher'
import { 
  each, 
  isArray
} from '../../../utils/index'

const initWatch = (vm) => {
  const { watch } = vm.$options

  each(watch, (key, handler) => {
    if (isArray(handler)) {
      each(handler, (_, h) => {
        createWatcher(vm, key, h)
      })
    } else {
      createWatcher(vm, key, handler)
    }
  })
}

export default initWatch