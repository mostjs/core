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
    throwIfErrors(disposeCollectErrors(this.disposables))
  }
}

// Dispose all, safely collecting errors into an array
const disposeCollectErrors = disposables =>
  reduce(appendIfError, [], disposables)

// Call dispose and if throws, append thrown error to errors
const appendIfError = (errors, d) => {
  try {
    d.dispose()
  } catch (e) {
    errors.push(e)
  }
  return errors
}

// Throw DisposeAllError if errors is non-empty
const throwIfErrors = errors => {
  if (errors.length > 0) {
    throw new DisposeAllError(`${errors.length} errors`, errors)
  }
}

export const DisposeAllError = (Error => {
  function DisposeAllError (message, errors) {
    Error.call(this, message)
    this.message = message
    this.name = DisposeAllError.name
    this.errors = errors

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DisposeAllError)
    }

    this.stack = `${this.stack}${formatErrorStacks(this.errors)}`
  }

  DisposeAllError.prototype = Object.create(Error.prototype)

  return DisposeAllError
})(Error)

const formatErrorStacks = errors =>
  reduce(formatErrorStack, '', errors)

const formatErrorStack = (s, e, i) =>
  s + `\n[${(i + 1)}] ${e.stack}`
