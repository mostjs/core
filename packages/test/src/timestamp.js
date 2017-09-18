export const withTime = stream =>
  new WithTime(stream)

class WithTime {
  constructor (source) {
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new WithTimeSink(sink), scheduler)
  }
}

class WithTimeSink {
  constructor (sink) {
    this.sink = sink
  }

  event (t, x) {
    this.sink.event(t, { time: t, value: x })
  }

  end (t) {
    this.sink.end(t)
  }

  error (t, e) {
    this.sink.error(t, e)
  }
}
