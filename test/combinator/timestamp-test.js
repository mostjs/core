/* global describe, it */
require('buster').spec.expose()
var expect = require('buster').expect

var timestamp = require('../../src/combinator/timestamp').timestamp
var periodic = require('../../src/source/periodic').periodic
var constant = require('../../src/combinator/transform').constant
var take = require('../../src/combinator/slice').take

import { ticks, collectEvents } from '../helper/testEnv'

var sentinel = 'sentinel'

describe('timestamp', function () {
  it('should emit time-value pairs', function () {
    var n = 10
    var s = take(n, timestamp(constant(sentinel, periodic(1))))

    return collectEvents(s, ticks(n)).then(function (events) {
      events.forEach(function ({ value: { time, value } }, i) {
        expect(value).toEqual(sentinel)
        expect(time).toEqual(i)
      })
    }, s)
  })
})
