import { describe, it } from 'mocha'
import { assert, fail, is, eq } from '@briancavalier/assert'

import { throwError, recoverWith } from '../../src/combinator/errors'
import { map } from '../../src/combinator/transform'
import { observe, drain } from '../helper/observe'
import { now } from '../../src/source/now'
import { empty, isCanonicalEmpty } from '../../src/source/empty'

const sentinel = { value: 'sentinel' }
const other = { value: 'other' }

describe('throwError', () => {
  it('should create a Stream containing only an error', () => {
    return observe(() => {
      throw other
    }, throwError(sentinel))
      .catch(eq(sentinel))
  })
})

describe('recoverWith', () => {
  it('given canonical empty stream, should return canonical empty', () => {
    const s = recoverWith(throwError, empty())
    assert(isCanonicalEmpty(s))
  })

  it('when an error is thrown should continue with returned stream', () => {
    const s = recoverWith(() => now(sentinel), throwError(other))
    return observe(eq(sentinel), s)
  })

  it('should recover from errors before recoverWith', () => {
    const s = map(() => {
      throw new Error()
    }, now(other))

    return observe(eq(sentinel),
      recoverWith(() => now(sentinel), s))
  })

  it('should not recover from errors after recoverWith', () => {
    const s = recoverWith(function (e) {
      throw other
    }, now(123))

    return observe(() => {
      throw sentinel
    }, s).catch(eq(sentinel))
  })

  it('should only recover first error if recovered stream also errors', () => {
    const s = recoverWith(() => throwError(sentinel), throwError(other))

    return observe(() => {
      throw new Error()
    }, s).catch(eq(sentinel))
  })

  it('when f throws, should propagate error', () => {
    const error = new Error()
    const s = recoverWith(x => { throw error }, throwError(new Error()))
    return drain(s).then(fail, is(error))
  })
})
