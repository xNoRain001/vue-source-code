import { each, isArray } from "../utils"

const dependArray = (val, target) => {
  each(val, (_, v) => {
    let ob = null

    if (v && (ob = v.__ob__)) {
      ob.dep.depend(target)
    }

    if (isArray(v)) {
      dependArray(v, target)
    }
  })
}

export default dependArray