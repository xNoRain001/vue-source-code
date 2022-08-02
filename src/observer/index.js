import { 
  has, 
  def,
  each,
  isArray,
  isObject, 
  isInstance,
  isPlainObject
} from "../utils"
import arrayMethods from "./array"

const observe = v => {
  // 原始值不用处理
  if (!isObject(v)) {
    return
  }

  let ob = null
  // 只是不想 ob = v.__ob__，这样就访问两次这个属性了。
  let _ob = null

  if (has(v, '__ob__') && isInstance((_ob = v.__ob__), Observer)) {
    ob = _ob
  } else if (isArray(v) || isPlainObject(v)) {
    ob = new Observer(v)
  }

  return ob
}

class Observer {
  constructor (v) {
    def(v, '__ob__', this)

    if (isArray(v)) {
      // 劫持
      v.__proto__ = arrayMethods

      this.observeArray(v)
    } else {
      each(v, (key, val) => {
        defineReactive(v, key, val)
      })
    }

    return this
  }

  observeArray (v) {
    each(v, (_, val) => {
      observe(val)
    })
  }
}

// 实现响应式
const defineReactive = (obj, key, val) => {
  // 所有层次的对象的属性
  observe(val)

  Object.defineProperty(obj, key, {
    get () {
      return val
    },

    set (newVal) {
      if (newVal !== val) {
        val = newVal

        observe(newVal)
      }
    }
  })
}

export default observe