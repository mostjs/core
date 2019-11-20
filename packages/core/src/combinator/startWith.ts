/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { now } from '../source/now'
import { continueWith } from './continueWith'
import { Stream } from '@most/types'

export const startWith = <A>(x: A, stream: Stream<A>): Stream<A> =>
  continueWith(() => stream, now(x))
