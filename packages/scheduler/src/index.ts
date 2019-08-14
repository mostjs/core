/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { curry2 } from '@most/prelude'

import Scheduler from './Scheduler'
import TimelineImpl from './Timeline'
import ClockTimer from './ClockTimer'
import { newPlatformClock } from './clock'
import { Clock, Timer, Timeline } from '@most/types'

export * from './clock'
export * from './schedule'
export * from './relative'

export const newScheduler = curry2((timer: Timer, timeline: Timeline): Scheduler => new Scheduler(timer, timeline))

export const newDefaultScheduler = (): Scheduler => new Scheduler(newDefaultTimer(), new TimelineImpl())

export const newDefaultTimer = (): Timer => new ClockTimer(newPlatformClock())
export const newClockTimer = (clock: Clock): Timer => new ClockTimer(clock)

export const newTimeline = (): Timeline => new TimelineImpl()
