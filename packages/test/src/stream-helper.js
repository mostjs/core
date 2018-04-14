/** @license MIT License (c) copyright 2018 original author or authors */

import { eq } from '@briancavalier/assert'
import { reduce } from './reduce'
import { curry2 } from '@most/prelude'

const toArray = s => reduce(function (a, x) {
  a.push(x)
  return a
}, [], s)

const arrayEquals = arrays => eq.apply(undefined, arrays)

export const assertSame = curry2((s1, s2) => Promise.all([toArray(s1), toArray(s2)]).then(arrayEquals))

export const expectArray = curry2((array, s) => toArray(s).then(eq(array)))
