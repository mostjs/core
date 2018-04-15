import { describe, it } from 'mocha'

import { makeEventsFromArray } from '../src/streamMockers'
import { assertSame, expectArray } from '../src/stream-helper'

describe('stream-helper', () => {
  it('assertSame should succeed when streams are the same', () => {
    const s1 = makeEventsFromArray(1, [1, 2, 3, 4])
    const s2 = makeEventsFromArray(1, [1, 2, 3, 4])
    return assertSame(s1, s2)
  })

  it('expectArray should succeed when arrays match', () => {
    const stream = makeEventsFromArray(1, [1, 2, 3, 4])
    const array = [
      {time: 0, value: 1},
      {time: 1, value: 2},
      {time: 2, value: 3},
      {time: 3, value: 4}
    ]
    return expectArray(array, stream)
  })
})
