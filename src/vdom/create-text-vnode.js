import createVnode from "./create-vnode"

const createTextVnode = text => {
  return createVnode(undefined, undefined, undefined, text)
}

export default createTextVnode
