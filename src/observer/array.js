import { each } from "../utils"

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
const methods = [
  'push', 
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

each(methods, (_, method) => {
  arrayMethods[method] = function (...args) {
    const context = this
    const original = arrayProto[method]
    const result = original.call(context, ...args)
    
    let inserted = null
    switch (method) {
      case 'push':
      case 'unshift': {
        inserted = args
        break
      }
      case 'splice': {
        inserted = args.splice(2)
        break
      }
    }

    context.__ob__.observeArray(inserted)
    // context.__ob__.dep.notify()

    return result
  }
})

export default arrayMethods