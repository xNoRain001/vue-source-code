import Observer from "."
import { 
  has, 
  isArray,
  isObject, 
  isInstance,
  isPlainObject
} from "../utils"

const observe = v => {
  // 原始值不用处理
  if (!isObject(v)) {
    return
  }

  let ob = null
  // 只是不想 ob = v.__ob__，这样就访问两次这个属性了。
  let _ob = null

  if (has(v, '__ob__') && isInstance((_ob = v.__ob__), Observer)) {
    ob = _ob
  } else if (isArray(v) || isPlainObject(v)) {
    ob = new Observer(v)
  }

  return ob
}

export default observe