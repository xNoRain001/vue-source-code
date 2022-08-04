import { each, isArray } from "../utils"

const dependArray = (val) => {
  each(val, (_, v) => {
    let ob = null

    if (v && (ob = v.__ob__)) {
      ob.dep.depend()
    }

    if (isArray(v)) {
      dependArray(v)
    }
  })
}

export default dependArray