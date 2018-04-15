/** @license MIT License (c) copyright 2018 original author or authors */

// @flow

import { disposeWith, disposeBoth } from '@most/disposable'
import { curry2 } from '@most/prelude'

function makeFakeDisposeStream (disposer, source) {
  return {
    run: (sink, scheduler) => disposeBoth(source.run(sink, scheduler), disposeWith(disposer, undefined))
  }
}

export const newFakeDisposeStream = curry2(makeFakeDisposeStream)
