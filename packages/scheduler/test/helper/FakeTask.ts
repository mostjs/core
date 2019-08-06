import { Time, Task } from '@most/types' // eslint-disable-line no-unused-vars

export class FakeTask implements Task {
  disposed: boolean;
  constructor (run: (t: Time) => void, error: (t: Time, e: Error) => void) {
    this.run = run
    this.error = error
    this.disposed = false
  }
  run (_t: Time): void {}
  error (_t: Time, e: Error): void {
    throw e
  }
  dispose () {
    this.disposed = true
  }
}

const noop = (_t: Time): void => {}
const rethrow = (_t: Time, e: Error): void => {
  throw e
}

export const noopTask = (): FakeTask =>
  new FakeTask(noop, rethrow)
