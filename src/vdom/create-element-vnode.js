import createVnode from "./create-vnode"

const createElementVnode = (tag, data, children) => {
  return createVnode(tag, data, children)
}

export default createElementVnode