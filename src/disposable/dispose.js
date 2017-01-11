/** @license MIT License (c) copyright 2010-2016 original author or authors */

import Disposable from './Disposable'
import SettableDisposable from './SettableDisposable'
import MemoizedDisposable from './MemoizedDisposable'
import { disposeSafely } from './disposeSafely'
import { isPromise } from '../Promise'
import { map, id } from '@most/prelude'

/**
 * Call disposable.dispose.  If it returns a promise, catch promise
 * error and forward it through the provided sink.
 * @param {number} t time
 * @param {{dispose: function}} disposable
 * @param {{error: function}} sink
 * @return {*} result of disposable.dispose
 */
export function tryDispose (t, disposable, sink) {
  const result = disposeSafely(disposable)
  return isPromise(result)
    ? result.catch(e => sink.error(t, e))
    : result
}

/**
 * Create a new Disposable which will dispose its underlying resource
 * at most once.
 * @param {function} dispose function
 * @param {*?} data any data to be passed to disposer function
 * @return {Disposable}
 */
export const create = (dispose, data) =>
  once(new Disposable(dispose, data))

/**
 * Create a noop disposable. Can be used to satisfy a Disposable
 * requirement when no actual resource needs to be disposed.
 * @return {Disposable|exports|module.exports}
 */
export const empty = () =>
  new Disposable(id, undefined)

/**
 * Create a disposable that will dispose all input disposables in parallel.
 * @param {Array<Disposable>} disposables
 * @return {Disposable}
 */
export const all = disposables =>
  create(disposeAll, disposables)

const disposeAll = disposables =>
  Promise.all(map(disposeSafely, disposables))

/**
 * Create a disposable from a promise for another disposable
 * @param {Promise<Disposable>} disposablePromise
 * @return {Disposable}
 */
export const promised = disposablePromise =>
  create(disposePromise, disposablePromise)

const disposePromise = disposablePromise =>
  disposablePromise.then(disposeOne)

const disposeOne = disposable =>
  disposable.dispose()

/**
 * Create a disposable proxy that allows its underlying disposable to
 * be set later.
 * @return {SettableDisposable}
 */
export const settable = () =>
  new SettableDisposable()

/**
 * Wrap an existing disposable (which may not already have been once()d)
 * so that it will only dispose its underlying resource at most once.
 * @param {{ dispose: function() }} disposable
 * @return {Disposable} wrapped disposable
 */
export const once = disposable =>
  new MemoizedDisposable(disposable)

