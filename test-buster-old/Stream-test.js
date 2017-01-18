import { spec, expect } from 'buster'
const { describe, it } = spec
import { default as Stream } from '../src/Stream'

var sentinel = { value: 'sentinel' }

describe('Stream', function () {
  it('should have expected source', function () {
    var s = new Stream(sentinel)
    expect(s.source).toBe(sentinel)
  })
})
