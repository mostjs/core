/** @license MIT License (c) copyright 2010 original author or authors */
import { append, reduce, curry2, concat } from '@most/prelude'
import { disposeNone, isDisposeNone } from './disposeNone'
import { Disposable } from '@most/types'

/**
 * Aggregate a list of disposables into a DisposeAll
 */
export const disposeAll = (ds: ArrayLike<Disposable>): Disposable => {
  const merged = reduce(merge, [], ds)
  return merged.length === 0 ? disposeNone() : new DisposeAll(merged)
}

/**
 * Convenience to aggregate 2 disposables
 */
export const disposeBoth = curry2((d1: Disposable, d2: Disposable): Disposable =>
  disposeAll([d1, d2]))

const merge = (ds: Disposable[], d: Disposable): Disposable[] =>
  isDisposeNone(d) ? ds
    : d instanceof DisposeAll ? concat(ds, d.disposables)
      : append(d, ds)

class DisposeAll implements Disposable {
  readonly disposables: ArrayLike<Disposable>

  constructor(disposables: ArrayLike<Disposable>) {
    this.disposables = disposables
  }

  dispose(): void {
    throwIfErrors(disposeCollectErrors(this.disposables))
  }
}

/**
 * Dispose all, safely collecting errors into an array
 */
const disposeCollectErrors = (disposables: ArrayLike<Disposable>): Error[] =>
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
const throwIfErrors = (errors: ArrayLike<Error>): void => {
  if (errors.length > 0) {
    throw new DisposeAllError(`${errors.length} errors`, errors)
  }
}

export class DisposeAllError implements Error {
  readonly name: string = 'DisposeAllError'
  readonly stack?: string;
  readonly message: string;
  readonly errors: ArrayLike<Error>;

  constructor(message: string, errors: ArrayLike<Error>) {
    this.message = message
    this.errors = errors
    Error.call(this, message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DisposeAllError)
    }
    this.stack = `${this.stack}${formatErrorStacks(this.errors)}`
  }
}
DisposeAllError.prototype = Object.create(Error.prototype)

const formatErrorStacks = (errors: ArrayLike<Error>): string =>
  reduce(formatErrorStack, '', errors)

const formatErrorStack = (s: string, e: Error, i: number): string =>
  s + `\n[${(i + 1)}] ${e.stack}`
