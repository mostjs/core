import { describe, it } from 'mocha'
import { is } from '@briancavalier/assert'
import { disposeNone } from '../src/disposeNone'

describe('disposeNone', () => {
  it('should return same instance', () => {
    is(disposeNone(), disposeNone())
  })
})
