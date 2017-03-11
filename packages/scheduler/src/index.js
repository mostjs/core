/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { curry2 } from '@most/prelude'

import Scheduler from './Scheduler'
import Timeline from './Timeline'
import ClockTimer from './ClockTimer'

const _newScheduler = (timer, timeline) => new Scheduler(timer, timeline)

export const newTimeline = () => new Timeline()
export const newClockTimer = () => new ClockTimer()

export const newScheduler = curry2(_newScheduler)

export const newDefaultScheduler = () => _newScheduler(newClockTimer(), newTimeline())
