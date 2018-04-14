/** @license MIT License (c) copyright 2018 original author or authors */

import { bind } from './helpers'

function timestampSink (sink) {
  return {
    error: bind(sink.error, sink),
    end: bind(sink.end, sink),
    event: (time, value) => sink.event(time, { time, value })
  }
}

export function timestamp (stream) {
  return {
    run: (sink, scheduler) => stream.run(timestampSink(sink), scheduler)
  }
}
