// @flow
import { describe, it } from 'mocha'
import { eq, assert } from '@briancavalier/assert'

import { empty, isCanonicalEmpty } from '../../src/source/empty'

import { collectEventsFor, makeEvents } from '../helper/testEnv'

describe('empty', () => {
  describe('isEmpty', () => {
    it('should return true given empty()', () => {
      assert(isCanonicalEmpty(empty()))
    })

    it('should return false given non-empty()', () => {
      assert(!isCanonicalEmpty(makeEvents(1, 0)))
    })
  })

  describe('empty', () => {
    it('should yield no items before end', () => {
      return collectEventsFor(1, empty()).then(eq([]))
    })
  })
})
