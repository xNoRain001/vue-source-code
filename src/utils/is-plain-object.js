const isPlainObject = v => {
  return Object.prototype.toString.call(v).slice(8, -1) === 'Object'
}

export default isPlainObject