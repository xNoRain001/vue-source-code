import Dep from "./dep"
import observe from "./observe"
import arrayMethods from "./array"
import defineReactive from "./define-reactive"
import { 
  def,
  each,
  isArray
} from "../utils"

class Observer {
  constructor (v) {
    this.dep = new Dep()

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

export default Observer