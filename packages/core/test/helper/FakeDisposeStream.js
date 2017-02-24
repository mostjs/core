import * as dispose from '../../src/disposable/dispose'

export default FakeDisposeStream

FakeDisposeStream.from = function (disposer, stream) {
  return new FakeDisposeStream(disposer, stream)
}

function FakeDisposeStream (disposer, source) {
  this.source = source
  this.disposable = dispose.create(disposer)
}

FakeDisposeStream.prototype.run = function (sink, scheduler) {
  return dispose.all([this.source.run(sink, scheduler), this.disposable])
}
