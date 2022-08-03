import craeteNode from "./create-node"

const createTextNode = text => {
  return craeteNode(undefined, undefined, undefined, text)
}

export default createTextNode
