/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { Disposable } from '@most/types'

export const disposeNone = (): Disposable => NONE
const NONE = new (class DisposeNone implements Disposable {
  dispose(): void{}
})()

export const isDisposeNone = (d: Disposable): boolean =>
  d === NONE
