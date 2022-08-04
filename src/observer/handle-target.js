import Dep from "./dep"

const stack = []
const pushTarget = target => {
  Dep.target = target
  stack.push(target)
}

const popTarget = () => {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export {
  popTarget,
  pushTarget
}