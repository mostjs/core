/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { disposeOnce } from './disposeOnce'
import { curry2 } from '@most/prelude'
import { Disposable } from '@most/types'

export interface DisposeWith {
  (): DisposeWith
  <R>(dispose: (resource: R) => void): (resource: R) => Disposable
  <R>(dispose: (resource: R) => void, resource: R): Disposable
}

/**
 * Create a Disposable that will use the provided
 * dispose function to dispose the resource
 */
export const disposeWith: DisposeWith = curry2((dispose, resource) =>
  disposeOnce(new DisposeWithImpl(dispose, resource)))

/**
 * Disposable represents a resource that must be
 * disposed/released. It aggregates a function to dispose
 * the resource and a handle to a key/id/handle/reference
 * that identifies the resource
 */
class DisposeWithImpl<R> implements Disposable {
  private _dispose: (resource: R) => void;
  private _resource: R;

  constructor(dispose: (resource: R) => void, resource: R) {
    this._dispose = dispose
    this._resource = resource
  }

  dispose(): void {
    this._dispose(this._resource)
  }
}
