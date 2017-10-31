/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { reduce, curry2 } from '@most/prelude'

// Aggregate a list of disposables into a DisposeAll
export const disposeAll = ds =>
  new DisposeAll(ds)

// Convenience to aggregate 2 disposables
export const disposeBoth = curry2((d1, d2) =>
  disposeAll([d1, d2]))

class DisposeAll {
  constructor (disposables) {
    this.disposables = disposables
  }

  dispose () {
    return throwIfErrors(disposeCollectErrors(this.disposables))
  }
}

// Dispose all, safely collecting errors into an array
const disposeCollectErrors = disposables =>
  reduce((errors, d) => {
    if (typeof errors.then === 'function') {
      return errors.then((errors) => appendIfError(errors, d))
    }
    return appendIfError(errors, d)
  }, [], disposables)

// Call dispose and if throws, append thrown error to errors
const appendIfError = (errors, d) => {
  try {
    const result = d.dispose()
    if (result && typeof result.then === 'function') {
      return result.then(() => Promise.resolve(errors), (e) => {
        return Promise.resolve([...errors, e])
      })
    }
  } catch (e) {
    return [...errors, e]
  }
  return errors
}

// Throw DisposeAllError if errors is non-empty
const throwIfErrors = errors => {
  if (typeof errors.then === 'function') {
    return errors
  }
  if (errors.length > 0) {
    throw new DisposeAllError(`${errors.length} errors`, errors)
  }
}

// Aggregate Error type for DisposeAll
export class DisposeAllError extends Error {
  constructor (message, errors) {
    super(message)
    this.message = message
    this.name = this.constructor.name
    this.errors = errors

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.stack = `${this.stack}${formatErrorStacks(this.errors)}`
  }

  toString () {
    return this.stack
  }
}

const formatErrorStacks = errors =>
  reduce(formatErrorStack, '', errors)

const formatErrorStack = (s, e, i) =>
  s + `\n[${(i + 1)}] ${e.stack}`
