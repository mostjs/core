/** @license MIT License (c) copyright 2016 original author or authors */

import { spec, referee } from 'buster'
const { describe, it } = spec
const { assert } = referee

// import {observe, empty, never, take, skip, periodic, throwError} from '../..'
import { throwError } from '../../src/combinator/errors'
import { just, never } from '../../src/source/core'
import { sample } from '../../src/combinator/sample'

import { makeEvents, ticks, collectEvents } from '../helper/testEnv'

const rint = n => Math.ceil(n * Math.random())

describe('sample', () => {
  describe('sample', () => {
    it('should pass in the sampler value', () => {
      const samplerValue = Math.random()
      const justValue = Math.random()
      const f = (a, b) => [a, b]
      const s = sample(f, just(samplerValue), just(justValue))
      return collectEvents(s, ticks(1)).then(events => {
        assert.same(1, events.length)
        assert.equals({ time: 0, value: [samplerValue, justValue] }, events[0])
      })
    })

    it('should produce no events before first stream event', () => {
      const n = rint(10)
      const s = sample(Array, makeEvents(1, n), never())
      return collectEvents(s, ticks(n)).then(events =>
        assert.same(0, events.length))
    })

    it('should end when sampler ends', () => {
      const n = rint(10)
      const s = sample(Array, makeEvents(1, n), makeEvents(5, n * 2))
      return collectEvents(s, ticks(n)).then(events =>
        assert.same(n, events.length))
    })

    it('should repeat last value after source ends', () => {
      const n = 1 + rint(10)
      const x = Math.random()
      const s = sample(Array, makeEvents(1, n), just(x))
      return collectEvents(s, ticks(n)).then(events => {
        assert.same(n, events.length)
        events.forEach((event, i) =>
          assert.equals({ time: i, value: [i, x] }, event))
      })
    })

    it('should error if stream errors', () => {
      const error = new Error('fail')
      const s = sample(Array, makeEvents(1, 1), throwError(error))
      return collectEvents(s, ticks(1)).catch(e =>
        assert.same(error, e))
    })
  })
})
