import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { generate } from '../../src/source/generate'
import { observe } from '../helper/observe'
import { getIterator } from '../../src/iterable'
import ArrayIterable from '../helper/ArrayIterable'
import delayPromise from '../helper/delayPromise'

const makeAsyncIterator = (ms, events) =>
  getIterator(new ArrayIterable(events.map(x => delayPromise(ms, x))))

describe('generate', function () {
  it('should contain iterable items', function () {
    const expected = [0, 1, 2, 3]
    const actual = []
    const s = generate(makeAsyncIterator, 10, expected)
    return observe(x => actual.push(x), s).then(() => eq(expected, actual))
  })
})
