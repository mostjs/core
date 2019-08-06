import { describe, it } from 'mocha'
import { is, throws } from '@briancavalier/assert'

import { runTask } from '../src/task'

describe('task', () => {
  describe('runTask', () => {
    it('should run task', () => {
      const expected = {}
      const task = {
        run: () => expected,
        error: (e: Error) => { throw e }
      }

      is(expected, runTask(task))
    })

    it('should call task.error if task.run throws', () => {
      const expected = new Error()
      const task = {
        run: () => { throw expected },
        error: (e: Error) => e
      }

      is(expected, runTask(task))
    })

    it('should propagate exception if task.error throws', () => {
      const expected = new Error()
      const task = {
        run: () => { throw new Error() },
        error: (_e: Error) => { throw expected }
      }

      is(expected, throws(() => runTask(task)))
    })
  })
})
