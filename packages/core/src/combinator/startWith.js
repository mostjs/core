/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { now } from '../source/now'
import { continueWith } from './continueWith'

export const startWith = (x, stream) =>
  continueWith(() => stream, now(x))
