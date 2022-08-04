import sameVnode from './same-vnode'
import createElm from './create-elm'
import patchVnode from './patch-vnode'
import findIdxInOld from './find-idx-in-old'
import createKeyToOldIdx from './create-key-to-old-idx'
import { isDef, isUndef } from '../utils'

const updateChildren = (parentElm, oldCh, ch) => {
  let oldStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]

  let newStartIdx = 0
  let newEndIdx = ch.length - 1
  let newStartVnode = ch[0]
  let newEndVnode = ch[newEndIdx]

  let oldKeyToIdx = null
  let idxInOld = null
  let vnodeToMove = null

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldEndVnode = oldCh[++oldStartIdx]
    }
    else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    }
    else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = ch[++newStartIdx]
    }
    else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = ch[--newEndIdx]
    }
    else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = ch[--newEndIdx]
    }
    else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = ch[++newStartIdx]
    }
    else {
      if (isUndef(oldKeyToIdx)) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      }
      const { key } = newStartVnode
      idxInOld = isDef(key)
        ? oldKeyToIdx[key]
        : findIdxInOld(oldCh, oldStartIdx, oldEndIdx, newStartVnode)

      if (isDef(idxInOld)) {
        vnodeToMove = oldCh[idxInOld]

        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode)
        }
        oldCh[idxInOld] = undefined
        parentElm.insertBefote(vnodeToMove.elm, oldStartVnode.elm)
        
      } else {
        parentElm.insertBefote(createElm(newStartVnode), oldStartVnode.elm)
      }

      newStartVnode = ch[++newStartIdx]
    }
  }

  if (oldStartIdx > oldEndIdx) {
    const refElm = isDef(ch[newEndIdx + 1])
      ? ch[newEndIdx + 1].elm
      : null

    for (let i = newStartIdx; i <= newEndIdx; i++) {
      parentElm.insertBefote(createElm(ch[i]), refElm)
    }
  }
  else if (newStartIdx > newEndIdx) {
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      if (isDef(oldCh[i])) {
        parentElm.removeChild(oldCh[i].elm)
      }
    }
  }
}

export default updateChildren