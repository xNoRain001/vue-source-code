import { each, isArray, isObject, isPlainObject } from "../utils"

const set = new Set()
const traverse = val => {
  _traverse(val, set)

  set.clear()
}

const _traverse = (val, set) => {
  if (!isObject(val)) {
    return
  }

  let ob = val.__ob__

  if (ob) {
    const { id } = ob.dep

    if (set.has(id)) {
      return
    }

    set.add(id)
  }

  if (isArray(val)) {
    each(val, (_, v) => {
      traverse(v, set)
    })
  }

  if (isPlainObject(val)) {
    each(val, (_, v) => {
      traverse(v, set)
    })
  }
}

export default traverse