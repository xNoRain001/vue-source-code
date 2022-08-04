import { isObject } from "../../utils"

const _s = val => {
  return isObject(val)
    ? JSON.stringify(val)
    : val
}

export default _s