import { Scheduler, Timeline, Timer, Time } from '@most/types';

export type Now = () => Time;

export type Clock = {
  now: Now
};

export function newScheduler (timer: Timer, timeline: Timeline): Scheduler;
export function newScheduler (timer: Timer): (timeline: Timeline) => Scheduler;

export function newDefaultScheduler (): Scheduler;

export function newClockTimer (clock: Clock): Timer;
export function newTimeline (): Timeline;

declare function newPlatformClock (): Clock;
declare function millisecondClockFromNow (now: Now): Clock;
declare function newPerformanceNowClock (): Clock;
declare function newDateNowClock (): Clock;
declare function newHRTimeClock (): Clock;
