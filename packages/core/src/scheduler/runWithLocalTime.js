/** @license MIT License (c) copyright 2010-2017 original author or authors */

import RelativeSink from '../sink/RelativeSink'
import { schedulerRelativeTo } from '@most/scheduler'

export const runWithLocalTime = (origin, stream, sink, scheduler) =>
  stream.run(new RelativeSink(origin, sink), schedulerRelativeTo(origin, scheduler))
