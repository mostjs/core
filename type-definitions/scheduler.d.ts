import { Timer, Timeline, Scheduler } from './types';

export function newDefaultScheduler(timer: Timer, timeline: Timeline): Scheduler;
export function newDefaultScheduler(timer: Timer): (timeline: Timeline) => Scheduler;

export function newTimeline(): Timeline;

export function newClockTimer(): Timer;
