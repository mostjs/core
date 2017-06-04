/** @license MIT License (c) copyright 2010-2017 original author or authors */

import RelativeSink from '../sink/RelativeSink'

export const runWithLocalTime = (origin, stream, sink, scheduler) =>
  stream.run(new RelativeSink(origin, sink), scheduler.relative(origin, scheduler))
