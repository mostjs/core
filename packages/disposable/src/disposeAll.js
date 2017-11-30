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

// Throw aggregate Error if errors is non-empty
const throwIfErrors = errors => {
  if (errors.length > 0) {
    const e = new Error(`${errors.length} errors`)
    e.errors = errors
    e.stack = formatErrorStacks(errors)
    throw e
  }
}

const formatErrorStacks = errors =>
  reduce(formatErrorStack, '', errors)

const formatErrorStack = (s, e, i) =>
  s + `\n[${(i + 1)}] ${e.stack}`
