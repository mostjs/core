export default class RelativeSink {
  constructor (offset, sink) {
    this.sink = sink
    this.offset = offset
  }

  event (t, x) {
    this.sink.event(t + this.offset, x)
  }

  error (t, e) {
    this.sink.error(t + this.offset, e)
  }

  end (t) {
    this.sink.end(t + this.offset)
  }
}
