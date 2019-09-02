import { describe, it } from 'mocha'
import { assert, is } from '@briancavalier/assert'
import { disposeNone, isDisposeNone } from '../src/disposeNone'

describe('disposeNone', () => {
  describe('disposeNone', () => {
    it('should return same instance', () => {
      is(disposeNone(), disposeNone())
    })
  })

  describe('isDisposeNone', () => {
    it('should be true for disposeNone', () => {
      assert(isDisposeNone(disposeNone()))
    })

    it('should be false for non-disposeNone', () => {
      assert(!isDisposeNone({ dispose() {} }))
    })
  })
})
