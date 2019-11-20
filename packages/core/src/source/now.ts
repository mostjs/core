/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { at } from './at'
import { Stream } from '@most/types'

export const now = <A>(x: A): Stream<A> => at(0, x)
