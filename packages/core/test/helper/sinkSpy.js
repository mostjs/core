'use strict'

export const sinkSpy = () => new SinkSpy(noop, noop, noop)

export const eventErrorSinkSpy = e => new SinkSpy(() => { throw e }, noop, noop)

export const endErrorSinkSpy = e => new SinkSpy(noop, () => { throw e }, noop)

const noop = () => {}

class SinkSpy {
  constructor (event, end, error) {
    this.eventCalled = 0
    this.eventTime = NaN
    this.eventValue = undefined
    this._event = event

    this.endCalled = 0
    this.endTime = NaN
    this.endValue = undefined
    this._end = end

    this.errorCalled = 0
    this.errorTime = NaN
    this.errorValue = undefined
    this._error = error
  }

  event (t, x) {
    this.eventCalled += 1
    this.eventTime = t
    this.eventValue = x
    return this._event(t, x)
  }

  end (t, x) {
    this.endCalled += 1
    this.endTime = t
    this.endValue = x
    return this._end(t, x)
  }

  error (t, e) {
    this.errorCalled += 1
    this.errorTime = t
    this.errorValue = e
    return this._error(t, e)
  }
}
