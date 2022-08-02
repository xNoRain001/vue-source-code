import { initState } from "./init"

class Vue {
  constructor (opts = {}) {
    this.$options = opts
    
    initState(this)
  }
}

export default Vue