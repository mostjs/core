import { eq } from '@briancavalier/assert'
import { reduce } from './reduce'
import { Stream } from '@most/types'

export function assertSame <A> (s1: Stream<A>, s2: Stream<A>): Promise<void> {
  return Promise.all([toArray(s1), toArray(s2)]).then(arrayEquals)
}

export function expectArray <A> (array: A[], s: Stream<A>): Promise<A[]> {
  return toArray(s).then(eq(array))
}

function toArray <A> (s: Stream<A>): Promise<A[]> {
  return reduce<A, A[]>(function (a, x) {
    a.push(x)
    return a
  }, [], s)
}

function arrayEquals <A> (ss: [A, A]): void {
  eq(ss[0], ss[1])
}
