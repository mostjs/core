/** @license MIT License (c) copyright 2010 original author or authors */
import { append, reduce, curry2 } from '@most/prelude'
import { disposeNone, isDisposeNone } from './disposeNone'
import { Disposable } from '@most/types' // eslint-disable-line no-unused-vars

/**
 * Aggregate a list of disposables into a DisposeAll
 */
export const disposeAll = (ds: Disposable[]): Disposable => {
  const merged = reduce(merge, [], ds)
  return merged.length === 0 ? disposeNone() : new DisposeAll(merged)
}

/**
 * Convenience to aggregate 2 disposables
 */
export const disposeBoth = curry2((d1: Disposable, d2: Disposable): Disposable =>
  disposeAll([d1, d2]))

const merge = (ds: Disposable[], d: Disposable) =>
  isDisposeNone(d) ? ds
    : d instanceof DisposeAll ? ds.concat(d.disposables)
      : append(d, ds)

class DisposeAll implements Disposable {
  readonly disposables: Disposable[]

  constructor (disposables: Disposable[]) {
    this.disposables = disposables
  }

  dispose () {
    throwIfErrors(disposeCollectErrors(this.disposables))
  }
}

/**
 * Dispose all, safely collecting errors into an array
 */
const disposeCollectErrors = (disposables: Disposable[]): Error[] =>
  reduce(appendIfError, [], disposables)

/**
 * Call dispose and if throws, append thrown error to errors
 */
const appendIfError = (errors: Error[], d: Disposable): Error[] => {
  try {
    d.dispose()
  } catch (e) {
    errors.push(e)
  }
  return errors
}

/**
 * Throw DisposeAllError if errors is non-empty
 * @throws
 */
const throwIfErrors = (errors: Error[]): void => {
  if (errors.length > 0) {
    throw new DisposeAllError(`${errors.length} errors`, errors)
  }
}

export class DisposeAllError implements Error {
  readonly name: string = 'DisposeAllError'
  readonly stack?: string;

  constructor (readonly message: string, readonly errors: Error[]) {
    Error.call(this, message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DisposeAllError)
    }
    this.stack = `${this.stack}${formatErrorStacks(this.errors)}`
  }
}
DisposeAllError.prototype = Object.create(Error.prototype)

const formatErrorStacks = (errors: Error[]): string =>
  reduce(formatErrorStack, '', errors)

const formatErrorStack = (s: string, e: Error, i: number): string =>
  s + `\n[${(i + 1)}] ${e.stack}`
