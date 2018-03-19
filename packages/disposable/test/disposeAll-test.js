import { describe, it } from 'mocha'
import { eq, assert, throws } from '@briancavalier/assert'
import { spy } from 'sinon'
import { disposeNone, isDisposeNone } from '../src/disposeNone'
import { disposeAll, disposeBoth, DisposeAllError } from '../src/disposeAll'

const noop = () => {}

const disposableSpy = f => ({
  dispose: spy(f)
})

const disposableSpies = () =>
  [disposableSpy(noop), disposableSpy(noop), disposableSpy(noop)]

const rethrow = e => () => {
  throw e
}

const assertDisposed = disposable => assert(disposable.dispose.calledOnce)

const assertAllDisposed = disposables =>
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
      eq(d1.length + d2.length, d.disposables.length)

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
      eq(error.errors, errors)
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
      eq(errors, error.errors)
    })

    it('should dispose both and aggregate left error', function () {
      const e = new Error()

      const d = disposeBoth(disposableSpy(rethrow(e)), disposableSpy(noop))
      const error = throws(() => d.dispose())

      assert(error instanceof DisposeAllError)
      eq([e], error.errors)
    })

    it('should dispose both and aggregate right error', function () {
      const e = new Error()

      const d = disposeBoth(disposableSpy(noop), disposableSpy(rethrow(e)))
      const error = throws(() => d.dispose())

      assert(error instanceof DisposeAllError)
      eq([e], error.errors)
    })
  })
})
