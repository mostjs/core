import { describe, it } from 'mocha'
import { rejects, eq } from '@briancavalier/assert'

import { throwError, recoverWith } from '../../src/combinator/errors'
import { map } from '../../src/combinator/transform'
import { observe, drain } from '../../src/combinator/observe'
import { just as just } from '../../src/source/core'

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
  it('when an error is thrown should continue with returned stream', () => {
    const s = recoverWith(() => just(sentinel), throwError(other))
    return observe(eq(sentinel), s)
  })

  it('should recover from errors before recoverWith', () => {
    const s = map(() => {
      throw new Error()
    }, just(other))

    return observe(eq(sentinel),
      recoverWith(() => just(sentinel), s))
  })

  it('should not recover from errors after recoverWith', () => {
    const s = recoverWith(function (e) {
      throw other
    }, just(123))

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
    return drain(s).then(rejects, eq(error))
  })
})
