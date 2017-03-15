import { Scheduler, Timeline, Timer } from '@most/types';

export function newClockTimer (): Timer;
export function newTimeline (): Timeline;

export function newScheduler (timer: Timer, timeline: Timeline): Scheduler;
export function newScheduler (timer: Timer): (timeline: Timeline) => Scheduler;

export function newDefaultScheduler (): Scheduler;
