import keys from "./keys"

const each = (target, fn) => {
  const _keys = keys(target)

  for (let i = 0, l = _keys.length; i < l; i++) {
    const key = _keys[i]

    fn.call(target, key, target[key])
  }
}

export default each