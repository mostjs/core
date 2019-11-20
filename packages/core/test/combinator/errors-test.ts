import { describe, it } from 'mocha'
import { assert, fail, is, eq } from '@briancavalier/assert'

import { throwError, recoverWith } from '../../src/combinator/errors'
import { map } from '../../src/combinator/transform'
import { observe, drain } from '../helper/observe'
import { now } from '../../src/source/now'
import { empty, isCanonicalEmpty } from '../../src/source/empty'

const sentinel = { value: 'sentinel' }
const sentinelError = new Error('sentinel')
const other = { value: 'other' }
const otherError = new Error('other')

describe('throwError', () => {
  it('should create a Stream containing only an error', () => {
    return observe(() => {
      throw sentinelError
    }, throwError(sentinelError))
      .catch(eq(sentinelError))
  })
})

describe('recoverWith', () => {
  it('given canonical empty stream, should return canonical empty', () => {
    const s = recoverWith(throwError, empty())
    assert(isCanonicalEmpty(s))
  })

  it('when an error is thrown should continue with returned stream', () => {
    const s = recoverWith(() => now(sentinel), throwError(otherError))
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
    const s = recoverWith(function () {
      throw other
    }, now(123))

    return observe(() => {
      throw sentinel
    }, s).catch(eq(sentinel))
  })

  it('should only recover first error if recovered stream also errors', () => {
    const s = recoverWith(() => throwError(sentinelError), throwError(otherError))

    return observe(() => {
      throw new Error()
    }, s).catch(eq(sentinelError))
  })

  it('when f throws, should propagate error', () => {
    const error = new Error()
    const s = recoverWith(() => { throw error }, throwError(new Error()))
    return drain(s).then(fail, is(error))
  })
})
