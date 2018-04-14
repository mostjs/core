import { describe, xit } from 'mocha'

import { timestamp } from '../src/timestamp'
import { atTimes } from '../src/testEnv'
import { assertSame } from '../src/stream-helper'

describe('timestamp', () => {
  xit('should tag event values with timestamp', () => {
    const original = [
      {time: 0, value: 1},
      {time: 1, value: 2},
      {time: 2, value: 3},
      {time: 3, value: 4}
    ]
    const source = timestamp(atTimes(original))
    const result = atTimes([
      {time: 0, value: {time: 0, value: 1}},
      {time: 1, value: {time: 1, value: 2}},
      {time: 2, value: {time: 2, value: 3}},
      {time: 3, value: {time: 3, value: 4}}
    ])
    return assertSame(source, result)
  })
})
