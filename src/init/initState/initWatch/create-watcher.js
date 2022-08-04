import { 
  isString,
  isPlainObject
} from '../../../utils/index'

const createWatcher = (vm, expOrFn, handler, options = {}) => {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }

  if (isString(handler)) {
    handler = vm[handler]
  }

  return vm.$watch(expOrFn, handler, options)
}

export default createWatcher