import Dep from "./dep"
import observe from "./observe"

const defineReactive = (obj, key, val) => {
  const dep = new Dep()

  // 所有层次的对象的属性
  observe(val)

  Object.defineProperty(obj, key, {
    get () {
      const { target } = Dep
      if (target) {
        dep.depend(target)
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