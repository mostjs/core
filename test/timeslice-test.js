/* global describe, it */
require('buster').spec.expose()
var expect = require('buster').expect

var timeslice = require('../src/combinator/timeslice')
var take = require('../src/combinator/slice').take
var periodic = require('../src/source/periodic').periodic
var core = require('../src/source/core')
var delay = require('../src/combinator/delay').delay
var Stream = require('../src/Stream').default

var streamOf = core.just
var never = core.never

import { activate } from '../src/activate'
import { ticks, collectEvents } from './helper/testEnv'
var FakeDisposeSource = require('./helper/FakeDisposeSource')
var endWith = require('./helper/endWith').endWith

var sentinel = { value: 'sentinel' }

describe('during', function () {
  it('should contain events at or later than min and earlier than max', function () {
    var stream = periodic(1)
    var timespan = delay(1, streamOf(delay(5, streamOf())))

    var s = timeslice.during(timespan, stream)
    return collectEvents(s, ticks(7))
      .then(function (events) {
        var len = events.length
        expect(len).toBe(5)
        expect(events[0].time).toBe(1)
        expect(events[len - 1].time).toBe(5)
      })
  })

  it('should dispose source stream', function () {
    var dispose = this.spy()
    var stream = new Stream(FakeDisposeSource.from(dispose, periodic(1)))
    var timespan = delay(1, streamOf(delay(5, streamOf())))

    var s = timeslice.during(timespan, stream)
    return collectEvents(s, ticks(6))
      .then(function () {
        expect(dispose).toHaveBeenCalledOnce()
      })
  })

  it('should dispose signals', function () {
    var dispose = this.spy()

    var stream = periodic(1)
    var timespan = delay(1, streamOf(delay(5, streamOf())))
    var dt = new Stream(FakeDisposeSource.from(dispose, timespan))

    var s = timeslice.during(dt, stream)
    return collectEvents(s, ticks(6))
      .then(function (events) {
        expect(events.length).toBe(5)
        expect(dispose).toHaveBeenCalledOnce()
      })
  })
})

describe('takeUntil', function () {
  it('should only contain events earlier than signal', function () {
    var stream = periodic(1)
    var signal = delay(3, streamOf())

    var s = timeslice.takeUntil(signal, stream)
    return collectEvents(s, ticks(5))
      .then(function (events) {
        expect(events.length).toBe(3)
      })
  })

  it('should dispose source stream', function () {
    var dispose = this.spy()
    var stream = new Stream(FakeDisposeSource.from(dispose, periodic(1)))
    var signal = delay(3, streamOf())

    var s = timeslice.takeUntil(signal, stream)
    return collectEvents(s, ticks(5))
      .then(function () {
        expect(dispose).toHaveBeenCalledOnce()
      })
  })

  it('should end immediately on signal', function () {
    var dispose = this.spy()
    var stream = new Stream(FakeDisposeSource.from(dispose, never()))
    var signal = streamOf()

    var s = timeslice.takeUntil(signal, stream)
    return collectEvents(s, ticks(1))
      .then(function (events) {
        expect(events.length).toBe(0)
        expect(dispose).toHaveBeenCalledOnce()
      })
  })

  it('should dispose signal', function () {
    var dispose = this.spy()
    var stream = periodic(1)
    var signal = new Stream(FakeDisposeSource.from(dispose, delay(3, streamOf())))

    var s = timeslice.takeUntil(signal, stream)
    return collectEvents(s, ticks(5))
      .then(function (events) {
        expect(events.length).toBe(3)
        expect(dispose).toHaveBeenCalledOnce()
      })
  })

  it('should use takeUntil value as end value', function () {
    var stream = periodic(1)
    var end = delay(3, streamOf(sentinel))

    var s = timeslice.takeUntil(end, stream)
    return activate(s, ticks(5))
      .then(function (x) {
        expect(x).toBe(sentinel)
      })
  })
})

describe('skipUntil', function () {
  it('should only contain events at or later than signal', function () {
    var n = 10
    var stream = take(n, periodic(1))
    var signal = delay(3, streamOf())

    var s = timeslice.skipUntil(signal, stream)
    return collectEvents(s, ticks(n))
      .then(function (events) {
        expect(events.length).toBe(7)
      })
  })

  it('should dispose signal', function () {
    var dispose = this.spy()
    var stream = take(10, periodic(1))
    var signal = new Stream(FakeDisposeSource.from(dispose, delay(3, streamOf())))

    var s = timeslice.skipUntil(signal, stream)
    return collectEvents(s, ticks(10))
      .then(function (events) {
        expect(events.length).toBe(7)
        expect(dispose).toHaveBeenCalledOnce()
      })
  })

  it('should preserve end value', function () {
    var stream = endWith(sentinel, take(3, periodic(1)))
    var start = delay(3, streamOf())

    var s = timeslice.skipUntil(start, stream)
    return activate(s, ticks(3))
      .then(function (x) {
        expect(x).toBe(sentinel)
      })
  })

  it('should allow end before start signal', function () {
    var stream = take(3, periodic(1))
    var start = delay(3, streamOf())
    var end = delay(1, streamOf(sentinel))

    var s = timeslice.skipUntil(start, timeslice.takeUntil(end, stream))
    return activate(s, ticks(3))
      .then(function (x) {
        expect(x).toBe(sentinel)
      })
  })
})
