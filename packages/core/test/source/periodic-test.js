import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { periodic } from '../../src/source/periodic'
import { take } from '../../src/combinator/slice'

import { collectEventsFor } from '../../test-buster-old/helper/testEnv'

describe('periodic', function () {
  it('should emit value at tick periods', function () {
    const n = 5
    const s = take(n, periodic(1))

    return collectEventsFor(n, s).then(eq([
      { time: 0, value: undefined },
      { time: 1, value: undefined },
      { time: 2, value: undefined },
      { time: 3, value: undefined },
      { time: 4, value: undefined }
    ]))
  })
})
