import { isArray } from "../utils"

const createVnode = function (tag, data, children, text, key, elm) {
  if (isArray(data)) {
    children = data
    data = ''
  }

  return {
    tag,
    data,
    children,
    text,
    key,
    elm
  }
}

export default createVnode