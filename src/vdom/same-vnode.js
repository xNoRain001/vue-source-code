const sameVnode = (a, b) => a.tag === b.tag && a.key === b.key

export default sameVnode