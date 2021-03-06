import RelativeScheduler from './RelativeScheduler'
import { curry2 } from '@most/prelude'
import { Time, Scheduler } from '@most/types'

export const schedulerRelativeTo = curry2((offset: Time, scheduler: Scheduler): Scheduler =>
  new RelativeScheduler(offset, scheduler))
