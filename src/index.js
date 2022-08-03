import { initProto } from "./init"

class Vue {
  constructor (opts = {}) {
    this.$options = opts
    
    this._init()
  }
}

initProto(Vue)

export default Vue