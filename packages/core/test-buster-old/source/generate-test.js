import { spec, expect } from 'buster'
const { describe, it } = spec
import { generate } from '../../src/source/generate'
import { reduce } from '../../src/combinator/reduce'
import * as iterable from '../../src/iterable'
import ArrayIterable from '../helper/ArrayIterable'
import delayPromise from '../helper/delayPromise'

function makeAsyncIterator (ms, n) {
  var a = new Array(n)
  for (var i = 0; i < n; ++i) {
    a[i] = delayPromise(ms, i)
  }

  return iterable.getIterator(new ArrayIterable(a))
}

describe('generate', function () {
  it('should contain iterable items', function () {
    return reduce(function (a, x) {
      a.push(x)
      return a
    }, [], generate(makeAsyncIterator, 10, 5)).then(function (a) {
      expect(a).toEqual([0, 1, 2, 3, 4])
    })
  })
})
