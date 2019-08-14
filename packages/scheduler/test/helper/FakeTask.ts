import { Time, Task } from '@most/types'

export class FakeTask implements Task {
  disposed: boolean;
  constructor (run: () => void, error: (t: Time, e: Error) => void) {
    this.run = run
    this.error = error
    this.disposed = false
  }
  run (): void {}
  error (_t: Time, e: Error): void {
    throw e
  }
  dispose (): void {
    this.disposed = true
  }
}

const noop = (): void => {}
const rethrow = (_t: Time, e: Error): void => {
  throw e
}

export const noopTask = (): FakeTask =>
  new FakeTask(noop, rethrow)
