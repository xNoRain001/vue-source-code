import Dep from "./dep"
import observe from "./observe"
import dependArray from "./dependArray"
import { isArray } from "../utils"

const defineReactive = (obj, key, val) => {
  const dep = new Dep()

  // 所有层次的对象的属性
  const childOb = observe(val)

  Object.defineProperty(obj, key, {
    get () {
      if (Dep.target) {
        dep.depend()

        if (childOb) {
          childOb.dep.depend()

          if (isArray(val)) {
            dependArray(val)
          }
        }
      }

      return val
    },

    set (newVal) {
      if (newVal !== val) {
        val = newVal

        dep.notify()
        observe(newVal)
      }
    }
  })
}

export default defineReactive