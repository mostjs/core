import Pipe from '../../src/sink/Pipe'

export const endWith = (endValue, stream) => ({
  run: (sink, scheduler) =>
    stream.run(new EndWithSink(endValue, sink), scheduler)
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
