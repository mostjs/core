/** @license MIT License (c) copyright 2016 original author or authors */

import { describe, it } from 'mocha'
import { is, eq } from '@briancavalier/assert'

import { throwError } from '../../src/combinator/errors'
import { now } from '../../src/source/now'
import { never } from '../../src/source/never'
import { sample } from '../../src/combinator/sample'

import { makeEvents, ticks, collectEvents } from '../helper/testEnv'

const rint = n => Math.ceil(n * Math.random())

describe('sample', () => {
  it('should pass in the sampler value', () => {
    const samplerValue = Math.random()
    const justValue = Math.random()

    const f = (a, b) => [a, b]
    const s = sample(f, now(samplerValue), now(justValue))

    return collectEvents(s, ticks(1)).then(events => {
      eq(1, events.length)
      eq({ time: 0, value: [samplerValue, justValue] }, events[0])
    })
  })

  it('should produce no events before first stream event', () => {
    const n = rint(10)
    const s = sample(Array, makeEvents(1, n), never())

    return collectEvents(s, ticks(n))
      .then(events => eq(0, events.length))
  })

  it('should end when sampler ends', () => {
    const n = rint(10)
    const s = sample(Array, makeEvents(1, n), makeEvents(5, n * 2))

    return collectEvents(s, ticks(n))
      .then(events => eq(n, events.length))
  })

  it('should repeat last value after source ends', () => {
    const n = 1 + rint(10)
    const x = Math.random()
    const s = sample(Array, makeEvents(1, n), now(x))

    return collectEvents(s, ticks(n)).then(events => {
      eq(n, events.length)
      events.forEach((event, i) =>
        eq({ time: i, value: [i, x] }, event))
    })
  })

  it('should error if stream errors', () => {
    const error = new Error('fail')
    const s = sample(Array, makeEvents(1, 1), throwError(error))

    return collectEvents(s, ticks(1))
      .catch(is(error))
  })
})
