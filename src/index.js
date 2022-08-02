import { initMixin } from "./init"

class Vue {
  constructor (opts = {}) {
    this.$options = opts
    
    this._init()
  }
}

initMixin(Vue) // _init、$mount

export default Vue