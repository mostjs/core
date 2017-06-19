/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { just } from '../source/core'
import { continueWith } from './continueWith'

export const startWith = (x, stream) =>
  continueWith(() => stream, just(x))
