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
      const { target } = Dep
      if (target) {
        dep.depend(target)

        if (childOb) {
          childOb.dep.depend(target)

          if (isArray(val)) {
            dependArray(val, target)
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