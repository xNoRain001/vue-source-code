import { isDef } from "../utils"

const createKeyToOldIdx = (ch, startIdx, endIdx) => {
  const map = {}

  for (let i = startIdx; i <= endIdx; i++) {
    const c = ch[i]

    if (isDef(c) && isDef(c.key)) {
      map[key] = i
    }
  }

  return map
}

export default createKeyToOldIdx