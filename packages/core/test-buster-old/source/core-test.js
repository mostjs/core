import { spec, expect } from 'buster'
const { describe, it } = spec
import * as core from '../../src/source/core'
import { observe } from '../../src/combinator/observe'

var sentinel = { value: 'sentinel' }

describe('of', function () {
  it('should contain one item', function () {
    return observe(function (x) {
      expect(x).toBe(sentinel)
    }, core.just(sentinel))
  })
})

describe('empty', function () {
  it('should yield no items before end', function () {
    return observe(function (x) {
      throw new Error('not empty ' + x)
    }, core.empty()).then(function () {
      expect(true).toBeTrue()
    })
  })
})
