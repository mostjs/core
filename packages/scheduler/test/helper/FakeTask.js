export class FakeTask {
  constructor (run, error) {
    this.run = run
    this.error = error
    this.disposed = false
  }
  run (t) {}
  error (t, e) {
    throw e
  }
  dispose () {
    this.disposed = true
  }
}

const noop = t => {}
const rethrow = (t, e) => {
  throw e
}

export const noopTask = () =>
  new FakeTask(noop, rethrow)
