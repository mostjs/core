export class FakeTask {
  constructor (run, error) {
    this.run = run
    this.error = error
  }
  run (t) {}
  error (t, e) {
    throw e
  }
}

const noop = t => {}
const rethrow = (t, e) => {
  throw e
}

export const noopTask = () =>
  new FakeTask(noop, rethrow)
