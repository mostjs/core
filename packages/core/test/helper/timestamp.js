import Pipe from '../../src/sink/Pipe'

export const timestamp = stream =>
  new Timestamp(stream)

class Timestamp {
  constructor(stream) {
    this.stream = stream
  }

  run (sink, scheduler) {
    return this.stream.run(new TimestampSink(sink), scheduler)
  }
}

class TimestampSink extends Pipe {
  constructor (sink) {
    super(sink)
  }

  event (time, value) {
    this.sink.event(time, { time, value })
  }
}
