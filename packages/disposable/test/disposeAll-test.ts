import { describe, it } from 'mocha'
import { eq, assert, throws } from '@briancavalier/assert'
import { spy, SinonSpy } from 'sinon'
import { disposeNone, isDisposeNone } from '../src/disposeNone'
import { disposeAll, disposeBoth, DisposeAllError } from '../src/disposeAll'

const noop = (): void => {}

interface DisposableSpy {
  dispose: SinonSpy
}
const disposableSpy = (f: Function): DisposableSpy => ({
  dispose: spy(f)
})

const disposableSpies = (): DisposableSpy[] =>
  [disposableSpy(noop), disposableSpy(noop), disposableSpy(noop)]

const rethrow = (e: Error) => (): never => {
  throw e
}

const assertDisposed = (disposable: DisposableSpy): boolean => assert(disposable.dispose.calledOnce)

const assertAllDisposed = (disposables: DisposableSpy[]): void =>
  disposables.forEach(assertDisposed)

describe('disposeAll', () => {
  describe('disposeAll', function () {
    it('should dispose all', function () {
      const disposables = disposableSpies()
      disposeAll(disposables).dispose()
      assertAllDisposed(disposables)
    })

    it('should fuse disposeNone', () => {
      const d = disposeAll([disposeNone(), disposeNone()])
      assert(isDisposeNone(d))
    })

    it('should fuse disposeAll', () => {
      const d1 = disposableSpies()
      const d2 = disposableSpies()

      const d = disposeAll([disposeAll(d1), disposeAll(d2)])
      eq(d1.length + d2.length, (d as any)['disposables'].length)

      d.dispose()
      assertAllDisposed(d1.concat(d2))
    })

    it('should dispose all and aggregate errors', function () {
      const errors = [new Error(), new Error()]
      const errorDisposables = errors.map(e => disposableSpy(rethrow(e)))

      const disposables = disposableSpies()
        .concat(errorDisposables)
        .concat(disposableSpies())

      const error = throws(() => disposeAll(disposables).dispose())

      assert(error instanceof DisposeAllError)
      eq((error as DisposeAllError).errors, errors)
    })
  })

  describe('disposeBoth', () => {
    it('should dispose both', function () {
      const d1 = disposableSpy(noop)
      const d2 = disposableSpy(noop)
      disposeBoth(d1, d2).dispose()
      assertDisposed(d1)
      assertDisposed(d2)
    })

    it('should dispose both and aggregate errors', function () {
      const errors = [new Error(), new Error()]
      const errorDisposables = errors.map(e => disposableSpy(rethrow(e)))

      const d = disposeBoth(errorDisposables[0], errorDisposables[1])
      const error = throws(() => d.dispose())

      assert(error instanceof DisposeAllError)
      eq(errors, (error as DisposeAllError).errors)
    })

    it('should dispose both and aggregate left error', function () {
      const e = new Error()

      const d = disposeBoth(disposableSpy(rethrow(e)), disposableSpy(noop))
      const error = throws(() => d.dispose())

      assert(error instanceof DisposeAllError)
      eq([e], (error as DisposeAllError).errors)
    })

    it('should dispose both and aggregate right error', function () {
      const e = new Error()

      const d = disposeBoth(disposableSpy(noop), disposableSpy(rethrow(e)))
      const error = throws(() => d.dispose())

      assert(error instanceof DisposeAllError)
      eq([e], (error as DisposeAllError).errors)
    })
  })
})
