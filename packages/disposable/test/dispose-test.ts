import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { dispose } from '../src/dispose'

describe('dispose', () => {
  it('should dispose disposable', () => {
    let disposed = 0
    const disposable = {
      dispose() {
        disposed += 1
      }
    }

    dispose(disposable)

    eq(1, disposed)
  })
})
