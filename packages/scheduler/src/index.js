/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { curry2 } from '@most/prelude'

import Scheduler from './Scheduler'
import Timeline from './Timeline'
import ClockTimer from './ClockTimer'
import { newPlatformClock } from './clock'

export * from './clock'
export { Scheduler, ClockTimer, Timeline }

export const newScheduler = curry2((timer, timeline) => new Scheduler(timer, timeline))

export const newDefaultScheduler = () => new Scheduler(new ClockTimer(newPlatformClock()), new Timeline())
