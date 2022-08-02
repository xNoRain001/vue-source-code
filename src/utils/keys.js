import isArrat from "./is-array"
import isPlainObject from "./is-plain-object"

const keys = target => {
  if (isArrat(target)) {
    return Object.keys(target)
  }
  else if (isPlainObject(target)) {
    return Object.getOwnPropertySymbols(target).concat(Object.keys(target))
  }
}

export default keys