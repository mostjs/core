import { disposeWith, disposeBoth } from '@most/disposable'

export default FakeDisposeStream

FakeDisposeStream.from = function(disposer, stream) {
  return new FakeDisposeStream(disposer, stream)
}

function FakeDisposeStream(disposer, source) {
  this.source = source
  this.disposable = disposeWith(disposer, undefined)
}

FakeDisposeStream.prototype.run = function(sink, scheduler) {
  return disposeBoth(this.source.run(sink, scheduler), this.disposable)
}
