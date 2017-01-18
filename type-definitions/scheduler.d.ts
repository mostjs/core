import { Timer, Timeline, Scheduler } from './types';

export function newScheduler(timer: Timer, timeline: Timeline): Scheduler;
export function newScheduler(timer: Timer): (timeline: Timeline) => Scheduler;

export function newTimeline(): Timeline;

export function newClockTimer(): Timer;

export function newDefaultScheduler(): Scheduler;
