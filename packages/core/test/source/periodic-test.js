import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { periodic } from '../../src/source/periodic'
import { take } from '../../src/combinator/slice'

import { collectEvents } from '@most/test'

describe('periodic', function () {
  it('should emit value at tick periods', function () {
    const n = 5
    const s = take(n, periodic(1))

    return collectEvents(s).then(eq([
      { time: 0, value: undefined },
      { time: 1, value: undefined },
      { time: 2, value: undefined },
      { time: 3, value: undefined },
      { time: 4, value: undefined }
    ]))
  })
})
