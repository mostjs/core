/** @license MIT License (c) copyright 2018 original author or authors */

// @flow
/* eslint-disable import/first */
import { curry2, curry3 } from '@most/prelude'

import { collectEventsFor as _collectEventsFor } from './collectors'
export { collectEvents } from './collectors'
export const collectEventsFor = curry2(_collectEventsFor)

import { newFakeDisposeStream as _newFakeDisposeStream } from './FakeDisposeStream'
export const newFakeDisposeStream = curry2(_newFakeDisposeStream)

import { newSinkSpy as _newSinkSpy } from './sinkSpy'
export { newEndErrorSinkSpy, newEventErrorSinkSpy } from './sinkSpy'
export const newSinkSpy = curry3(_newSinkSpy)

import { assertSame as _assertSame, expectArray as _expectArray } from './stream-helper'
export const assertSame = curry2(_assertSame)
export const expectArray = curry2(_expectArray)

import { makeEvents as _makeEvents, makeEventsFromArray as _makeEventsFromArray } from './streamMockers'
export { atTimes } from './streamMockers'
export const makeEvents = curry2(_makeEvents)
export const makeEventsFromArray = curry2(_makeEventsFromArray)
