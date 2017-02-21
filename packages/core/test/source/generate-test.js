import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { generate } from '../../src/source/generate'
import { reduce } from '../../src/combinator/reduce'
import { getIterator } from '../../src/iterable'
import ArrayIterable from '../helper/ArrayIterable'
import delayPromise from '../helper/delayPromise'

function makeAsyncIterator (ms, n) {
  const a = new Array(n)
  for (let i = 0; i < n; ++i) {
    a[i] = delayPromise(ms, i)
  }

  return getIterator(new ArrayIterable(a))
}

describe('generate', function () {
  it('should contain iterable items', function () {
    const s = generate(makeAsyncIterator, 10, 5)
    return reduce((a, x) => a.concat(x), [], s).then(eq([0, 1, 2, 3, 4]))
  })
})
