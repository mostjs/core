'use strict'

import { Time } from '@most/types' // eslint-disable-line no-unused-vars

export const sinkSpy = () => new SinkSpy(noop, noop, noop)

export const eventErrorSinkSpy = (e: Error) => new SinkSpy(() => { throw e }, noop, noop)

export const endErrorSinkSpy = (e: Error) => new SinkSpy(noop, () => { throw e }, noop)

const noop = () => {}

class SinkSpy<A> {
  eventCalled = 0
  eventTime = NaN
  eventValue?: A
  _event: (t: Time, a: A) => void
  endCalled = 0
  endTime = NaN
  _end: (t: Time) => void
  errorCalled = 0
  errorTime = NaN
  errorValue?: Error
  _error: (t: Time, error: Error) => void

  constructor (event: (t: Time, a: A) => void, end: (t: Time) => void, error: (t: Time, error: Error) => void) {
    this._event = event
    this._end = end
    this._error = error
  }

  event (t: Time, x: A) {
    this.eventCalled += 1
    this.eventTime = t
    this.eventValue = x
    return this._event(t, x)
  }

  end (t: Time) {
    this.endCalled += 1
    this.endTime = t
    return this._end(t)
  }

  error (t: Time, e: Error) {
    this.errorCalled += 1
    this.errorTime = t
    this.errorValue = e
    return this._error(t, e)
  }
}
