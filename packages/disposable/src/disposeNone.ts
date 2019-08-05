/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { Disposable } from '@most/types' // eslint-disable-line no-unused-vars

export const disposeNone = (): Disposable => NONE
const NONE = new (class DisposeNone {
  dispose () {}
})()

export const isDisposeNone = (d: Disposable): boolean =>
  d === NONE
