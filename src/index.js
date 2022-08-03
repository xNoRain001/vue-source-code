import { initMixin, renderMix } from "./init"

class Vue {
  constructor (opts = {}) {
    this.$options = opts
    
    this._init()
  }
}

initMixin(Vue) // _init、$mount
renderMix(Vue) // _render、_c、_v、_s

export default Vue