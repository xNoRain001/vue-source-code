import { initMixin, renderMix, lifecycleMixin } from "./init"

class Vue {
  constructor (opts = {}) {
    this.$options = opts
    
    this._init()
  }
}

initMixin(Vue) // _init、$mount
renderMix(Vue) // _render、_c、_v、_s
lifecycleMixin(Vue) // _update

export default Vue