import { describe, it } from 'mocha'
import { eq, is } from '@briancavalier/assert'

import SafeSink from '../../src/sink/SafeSink'
import { Time, Sink } from '@most/types'

function testSink <A> (event: (t: Time, a: A) => void, end: (t: Time) => void, error: (t: Time, error: Error) => void): Sink<A> {
  return {
    event: event,
    end: end,
    error: error
  }
}

function testEvent <A> (event: (t: Time, a: A) => void): Sink<A> {
  return testSink(event, fail, fail)
}

function testEnd (end: (t: Time) => void): Sink<unknown> {
  return testSink(fail, end, fail)
}

function testError (error: (t: Time, error: Error) => void): Sink<unknown> {
  return testSink(fail, fail, error)
}

function fail (): never {
  throw new Error('Should not be called')
}

function noop (): void {}

describe('SafeSink', function () {
  it('should propagate event while active', function () {
    const time = 123
    const expected = {}
    const sink = new SafeSink(testEvent(function (t, x) {
      eq(time, t)
      eq(expected, x)
    }))

    sink.event(time, expected)
  })

  it('should propagate end while active', function () {
    const time = 123
    const sink = new SafeSink(testEnd(t => {
      eq(time, t)
    }))

    sink.end(time)
  })

  it('should propagate error while active', function () {
    const time = 123
    const expected = new Error()
    const sink = new SafeSink(testError((t, x) => {
      eq(time, t)
      eq(expected, x)
    }))

    sink.error(time, expected)
  })

  it('should not propagate event or end after end', function () {
    const time = 123
    const expected = {}
    const sink = new SafeSink(testEnd(t => {
      eq(time, t)
    }))

    sink.end(time)
    sink.end(time + 1)
    sink.event(time + 2, expected)
  })

  it('should not propagate event or end after error', function () {
    const time = 123
    const expected = new Error()
    const sink = new SafeSink(testError((t, x) => {
      eq(time, t)
      eq(expected, x)
    }))

    sink.error(time, expected)
    sink.end(time + 1)
    sink.event(time + 2, expected)
  })

  it('should not propagate event or end after disabled', function () {
    const sink = new SafeSink(testSink(fail, fail, fail))

    sink.disable()
    sink.end(1)
    sink.event(2, {})
  })

  it('should propagate error after disable', function () {
    let errorCalled = 0
    const sink = new SafeSink(testError(function () {
      errorCalled += 1
    }))

    sink.disable()
    sink.error(1, new Error())
    eq(1, errorCalled)
  })

  it('should propagate error after end', function () {
    let errorCalled = 0
    const sink = new SafeSink(testSink(fail, noop, function () {
      errorCalled += 1
    }))

    sink.end(0)
    sink.error(1, new Error())
    eq(1, errorCalled)
  })

  it('should propagate error after error', function () {
    let errorCalled = 0
    const sink = new SafeSink(testSink(fail, noop, function () {
      errorCalled += 1
    }))

    sink.error(0, new Error())
    sink.error(1, new Error())
    eq(2, errorCalled)
  })

  it('disable should return original sink', function () {
    const original = testSink(fail, fail, fail)
    const sink = new SafeSink(original)

    is(original, sink.disable())
  })
})
