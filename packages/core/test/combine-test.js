import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'

import { combine, combineArray } from '../src/combinator/combine'
import { delay } from '../src/combinator/delay'
import { now } from '../src/source/now'
import { empty, isCanonicalEmpty } from '../src/source/empty'

import { collectEventsFor, makeEvents, makeEventsFromArray } from './helper/testEnv'

const sentinel = { value: 'sentinel' }

describe('combine', function () {
  it('given one canonical empty stream, should return canonical empty', () => {
    const s = combine(Array, now(0), empty())
    assert(isCanonicalEmpty(s))
  })

  it('given one canonical empty stream, should return canonical empty', () => {
    const s = combine(Array, empty(), now(1))
    assert(isCanonicalEmpty(s))
  })

  it('given two canonical empty streams, should return canonical empty', () => {
    const s = combine(Array, empty(), empty())
    assert(isCanonicalEmpty(s))
  })

  it('should yield initial only after all inputs yield', function () {
    const s1 = now(1)
    const s2 = now(sentinel)

    const sc = combine(Array, s1, delay(1, s2))

    return collectEventsFor(2, sc)
      .then(eq([{ time: 1, value: [1, sentinel] }]))
  })

  it('should yield when any input stream yields', function () {
    const a = ['a', 'b', 'c', 'd']
    const s1 = makeEvents(2, a.length)
    const s2 = delay(1, makeEventsFromArray(2, a))

    const sc = combine(Array, s1, s2)

    return collectEventsFor(2 * a.length, sc)
      .then(eq([
        { time: 1, value: [ 0, 'a' ] },
        { time: 2, value: [ 1, 'a' ] },
        { time: 3, value: [ 1, 'b' ] },
        { time: 4, value: [ 2, 'b' ] },
        { time: 5, value: [ 2, 'c' ] },
        { time: 6, value: [ 3, 'c' ] },
        { time: 7, value: [ 3, 'd' ] }]))
  })
})

describe('combineArray', function () {
  it('given empty array, should return canonical empty', () => {
    const s = combineArray(Array, [])
    assert(isCanonicalEmpty(s))
  })

  it('given array containing canonical empty, should return canonical empty', () => {
    const s = combineArray(Array, [now(0), empty(), now(1)])
    assert(isCanonicalEmpty(s))
  })

  it('should yield initial only after all inputs yield', function () {
    const s1 = now(1)
    const s2 = now(sentinel)

    const sc = combineArray(Array, [s1, delay(1, s2)])

    return collectEventsFor(2, sc)
      .then(eq([{ time: 1, value: [1, sentinel] }]))
  })

  it('should yield when any input stream yields', function () {
    const a = ['a', 'b', 'c', 'd']
    const s1 = makeEvents(2, a.length)
    const s2 = delay(1, makeEventsFromArray(2, a))

    const sc = combineArray(Array, [s1, s2])

    return collectEventsFor(2 * a.length, sc)
      .then(eq([
        { time: 1, value: [ 0, 'a' ] },
        { time: 2, value: [ 1, 'a' ] },
        { time: 3, value: [ 1, 'b' ] },
        { time: 4, value: [ 2, 'b' ] },
        { time: 5, value: [ 2, 'c' ] },
        { time: 6, value: [ 3, 'c' ] },
        { time: 7, value: [ 3, 'd' ] }]))
  })
})
