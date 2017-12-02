// @flow
import { describe, it } from 'mocha'
import { eq, assert } from '@briancavalier/assert'

import { empty, isCanonicalEmpty, containsCanonicalEmpty } from '../../src/source/empty'
import { now } from '../../src/source/now'

import { collectEventsFor, makeEvents } from '../helper/testEnv'

describe('empty', () => {
  describe('isCanonicalEmpty', () => {
    it('given empty(), should return true', () => {
      assert(isCanonicalEmpty(empty()))
    })

    it('given non-empty(), should return false', () => {
      assert(!isCanonicalEmpty(makeEvents(1, 0)))
    })
  })

  describe('containsCanonicalEmpty', () => {
    it('given empty array, should return false', () => {
      assert(!containsCanonicalEmpty([]))
    })

    it('given array containing  empty(), should return true', () => {
      assert(containsCanonicalEmpty([now(0), empty(), now(1)]))
    })

    it('given array containing only non-empty(), should return false', () => {
      assert(!containsCanonicalEmpty([now(0), now(1)]))
    })
  })

  describe('empty', () => {
    it('should yield no items before end', () => {
      return collectEventsFor(1, empty()).then(eq([]))
    })
  })
})
