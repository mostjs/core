/** @license MIT License (c) copyright 2018 original author or authors */

// @flow

import type { Stream } from '@most/types'
import { disposeWith, disposeBoth } from '@most/disposable'

export function newFakeDisposeStream<A> (disposer: () => void, source: Stream<A>): Stream<A> {
  return {
    run: (sink, scheduler) => disposeBoth(source.run(sink, scheduler), disposeWith(disposer, undefined))
  }
}
