import { each } from "../utils"

const parsePath = path => {
  const segments = path.split('.')

  return vm => {
    each(segments, (_, key) => {
      vm = vm[key]
    })

    return vm
  }
}

export default parsePath