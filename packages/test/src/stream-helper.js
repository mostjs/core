/** @license MIT License (c) copyright 2018 original author or authors */

// @flow

import type { Stream } from '@most/types'
import type { TimeStampedEvents } from './collectors'
import { eq } from '@briancavalier/assert'
import { collectEvents } from './collectors'

export function assertSame<A> (s1: Stream<A>, s2: Stream<A>): Promise<boolean> {
  return Promise
    .all([
      collectEvents(s1),
      collectEvents(s2)
    ])
    .then(function ([result1, result2]) {
      eq(result1, result2)
      return true
    })
}

export function expectArray<A> (array: TimeStampedEvents<A>, s: Stream<A>): Promise<void> {
  return collectEvents(s).then((results) => { eq(array, results) })
}
