// @flow
import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { at } from '../../src/source/at'
import { collectEventsFor } from '../helper/testEnv'
import { timestamp } from '../helper/timestamp'
import { withLocalTime } from '../../src/combinator/withLocalTime'

describe('withLocalTime', () => {
  it('should localize upstream times and unlocalize downstream times', () => {
    const s = withLocalTime(1, timestamp(at(1, 1)))
    return collectEventsFor(1, s)
      .then(eq([{
        time: 1, value: { time: 0, value: 1 }
      }]))
  })
})
