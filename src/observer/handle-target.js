import Dep from "./dep"

const pushTarget = target => {
  Dep.target = target
}

const popTarget = () => {
  Dep.target = null
}

export {
  popTarget,
  pushTarget
}