/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { disposeOnce } from './disposeOnce'
import { curry2 } from '@most/prelude'

// Create a Disposable that will use the provided
// dispose function to dispose the resource
export const disposeWith = curry2((dispose, resource) =>
  disposeOnce(new DisposeWith(dispose, resource)))

// Disposable represents a resource that must be
// disposed/released. It aggregates a function to dispose
// the resource and a handle to a key/id/handle/reference
// that identifies the resource
class DisposeWith {
  constructor (dispose, resource) {
    this._dispose = dispose
    this._resource = resource
  }

  dispose () {
    return this._dispose(this._resource)
  }
}
