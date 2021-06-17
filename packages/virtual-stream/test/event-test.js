// @flow
import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'
import { at } from '../src/event'

describe('event', () => {
  it('should create event', () => {
    const time = Date.now()
    const value = Math.random()
    const e = at(time, value)

    eq(time, e.time)
    eq(value, e.value)
  })
})
