import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'
import { makeEventsFromArray } from '../src/testEnv'
import { reduce } from '../src/reduce'

describe('reduce', () => {
  it('should reduce correctly with primitive initial values', () => {
    const source = makeEventsFromArray(1, [1, 2, 3, 4])
    const expected = 10
    const add = (x, y) => x + y
    return reduce(add, 0, source).then(eq(expected))
  })
})
