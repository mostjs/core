import { eq } from '@briancavalier/assert'
import { reduce } from './reduce'

export function assertSame(s1, s2) {
  return Promise.all([toArray(s1), toArray(s2)]).then(arrayEquals)
}

export function expectArray(array, s) {
  return toArray(s).then(eq(array))
}

function toArray(s) {
  return reduce(
    function(a, x) {
      a.push(x)
      return a
    },
    [],
    s
  )
}

function arrayEquals(ss) {
  eq(ss[0], ss[1])
}
