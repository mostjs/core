import { Scheduler, Timeline, Timer, Time } from '@most/types';

export type Clock = {
  now: () => Time
};

export function newScheduler (timer: Timer, timeline: Timeline): Scheduler;
export function newScheduler (timer: Timer): (timeline: Timeline) => Scheduler;

export function newDefaultScheduler (): Scheduler;

export function newClockTimer (clock: Clock): Timer;
export function newTimeline (): Timeline;

export function newPlatformClock (): Clock;
export function newPerformanceNowClock (): Clock;
export function newDateNowClock (): Clock;
export function newHRTimeClock (): Clock;
export function relativeClock (clock: Clock): Clock;
