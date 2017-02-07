import Pipe from '../../src/sink/Pipe'

export const endWith = (endValue, stream) =>
  new stream.constructor({
    run: (sink, scheduler) =>
      stream.source.run(new EndWithSink(endValue, sink), scheduler)
  })

class EndWithSink extends Pipe {
  constructor (value, sink) {
    super(sink)
    this.value = value
  }

  end (t, _) {
    this.sink.end(t, this.value)
  }
}
