import _c from './_c'
import _v from './_v'
import _s from './_s'
import _init from './_init'
import $mount from './$mount'
import $watch from './$watch'
import _update from './_update'
import _render from './_render'

const initProto = Vue => {
  Vue.prototype._c = _c
  Vue.prototype._v = _v
  Vue.prototype._s = _s
  Vue.prototype._init = _init
  Vue.prototype.$mount = $mount
  Vue.prototype.$watch = $watch
  Vue.prototype._update = _update
  Vue.prototype._render = _render
}

export default initProto