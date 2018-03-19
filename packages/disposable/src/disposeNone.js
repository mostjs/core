/** @license MIT License (c) copyright 2010-2017 original author or authors */

export const disposeNone = () => NONE
const NONE = new (class DisposeNone {
  dispose () {}
})()

export const isDisposeNone = d =>
  d === NONE
