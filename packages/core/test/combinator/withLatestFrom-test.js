/** @license MIT License (c) copyright 2016 original author or authors */

import { describe, it } from 'mocha'
import { is, eq } from '@briancavalier/assert'

import { throwError } from '../../src/combinator/errors'
import { now } from '../../src/source/now'
import { never } from '../../src/source/never'
import { zipLatestFrom } from '../../src/combinator/withLatestFrom'

import { makeEvents, ticks, collectEvents } from '../helper/testEnv'

const rint = n => Math.ceil(n * Math.random())

describe('zipLatestFrom', () => {
  it('should pass in the sampler value', () => {
    const streamValue = Math.random()
    const referenceValue = Math.random()

    const f = (a, b) => [a, b]
    const s = zipLatestFrom(f, now(referenceValue), now(streamValue))

    return collectEvents(s, ticks(1)).then(events => {
      eq(1, events.length)
      eq({ time: 0, value: [referenceValue, streamValue] }, events[0])
    })
  })

  it('should produce no events before first stream event', () => {
    const n = rint(10)
    const s = zipLatestFrom(Array, never(), makeEvents(1, n))

    return collectEvents(s, ticks(n))
      .then(events => eq(0, events.length))
  })

  it('should end when sampler ends', () => {
    const n = rint(10)
    const s = zipLatestFrom(Array, makeEvents(5, n * 2), makeEvents(1, n))

    return collectEvents(s, ticks(n))
      .then(events => eq(n, events.length))
  })

  it('should repeat last value after source ends', () => {
    const n = 1 + rint(10)
    const x = Math.random()
    const s = zipLatestFrom(Array, now(x), makeEvents(1, n))

    return collectEvents(s, ticks(n)).then(events => {
      eq(n, events.length)
      events.forEach((event, i) =>
        eq({ time: i, value: [x, i] }, event))
    })
  })

  it('should error if values stream errors', () => {
    const error = new Error('fail')
    const s = zipLatestFrom(Array, throwError(error), makeEvents(1, 1))

    return collectEvents(s, ticks(1))
      .catch(is(error))
  })
})
