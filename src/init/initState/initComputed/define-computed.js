import createComputedGetter from "./create-computed-getter"
import { noop, isFunction } from "../../../utils"

const propertyDefinition = {}

const defineComputed = (vm, key, userDef) => {
  if (isFunction(userDef)) {
    propertyDefinition.get = createComputedGetter(key)
    propertyDefinition.set = noop
  } else {
    propertyDefinition.get = userDef.getter
    propertyDefinition.set = userDef.set || noop
  } 

  Object.defineProperty(vm, key, propertyDefinition)
}

export default defineComputed