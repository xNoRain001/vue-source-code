import { isObject } from "../../utils"

const renderMix = Vue => {
  Vue.prototype.render = function () {
    const vm = this
    const { render } = vm.$options

    return render.call(vm) // Vnode
  }

  Vue.prototype._c = () => {
    
  }

  Vue.prototype._v = () => {
    
  }

  Vue.prototype._s = val => {
    return isObject(val)
      ? JSON.stringify(val)
      : val
  }
}

export default renderMix