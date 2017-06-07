import RelativeScheduler from './RelativeScheduler'
import { curry2 } from '@most/prelude'

export const schedulerRelativeTo = curry2((offset, scheduler) =>
  new RelativeScheduler(offset, scheduler))
