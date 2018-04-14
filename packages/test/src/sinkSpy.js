/** @license MIT License (c) copyright 2018 original author or authors */

import { noop } from './helpers'

export function newSinkSpy (eventCb = noop, endCb = noop, errorCb = noop) {
  let eventCalled = 0
  let eventTime = NaN
  let eventValue
  let endCalled = 0
  let endTime = NaN
  let errorCalled = 0
  let errorTime = NaN
  let errorValue

  return {
    event: function (time, value) {
      eventCalled = eventCalled + 1
      eventTime = time
      eventValue = value
      return eventCb(time, value)
    },
    eventCalled: () => eventCalled,
    eventTime: () => eventTime,
    eventValue: () => eventValue,
    end: function (time) {
      endCalled = endCalled + 1
      endTime = time
      return endCb(time)
    },
    endCalled: () => endCalled,
    endTime: () => endTime,
    error: function (time, error) {
      errorCalled += 1
      errorTime = time
      errorValue = error
      return error(time, error)
    },
    errorCalled: () => errorCalled,
    errorTime: () => errorTime,
    errorValue: () => errorValue
  }
}

export const newEventErrorSinkSpy = e => newSinkSpy(() => { throw e })

export const newEndErrorSinkSpy = e => newSinkSpy(undefined, () => { throw e })
