import proxy from "./proxy"
import observe from "../../../observer/observe"
import { 
  each,
  isFunction, 
  isPlainObject 
} from "../../../utils"

const initData = (vm) => {
  let { data } = vm.$options

  vm._data = data = isFunction(data)
    ? data.call(vm)
    : data || {}

  // data 必须是纯对象
  if (!isPlainObject) {
    data = {}
  }

  // data / vm._data 的每个属性代理到 vm 上
  each(data, (key) => {
    proxy(vm, '_data', key)
  })

  // data 响应式
  observe(data)
}

export default initData