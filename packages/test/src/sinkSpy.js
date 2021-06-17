/** @license MIT License (c) copyright 2018 original author or authors */

// @flow

import type { Sink, Time } from '@most/types'

const noop = () => undefined

export type SinkSpy<A> = Sink<A> & {
  eventCalled(): number,
  eventTime(): Time,
  eventValue(): A,
  endCalled(): number,
  endTime(): Time,
  errorCalled(): number,
  errorTime(): Time,
  errorValue(): Error
}

export function newSinkSpy<A> (
  eventCb: (time: Time, value: A) => void = noop,
  endCb: (time: Time) => void = noop,
  errorCb: (time: Time, error: Error) => void = noop
): SinkSpy<A> {
  let eventCalled = 0
  let eventTime = NaN
  let eventValue: A
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
      eventCb(time, value)
    },
    eventCalled: () => eventCalled,
    eventTime: () => eventTime,
    eventValue: () => eventValue,
    end: function (time) {
      endCalled = endCalled + 1
      endTime = time
      endCb(time)
    },
    endCalled: () => endCalled,
    endTime: () => endTime,
    error: function (time, error) {
      errorCalled += 1
      errorTime = time
      errorValue = error
      errorCb(time, error)
    },
    errorCalled: () => errorCalled,
    errorTime: () => errorTime,
    errorValue: () => errorValue
  }
}

export function newEndErrorSinkSpy (e: Error) {
  return (newSinkSpy(noop, () => { throw e }): SinkSpy<void>)
}

export function newEventErrorSinkSpy (e: Error) {
  return (newSinkSpy(() => { throw e }): SinkSpy<void>)
}
