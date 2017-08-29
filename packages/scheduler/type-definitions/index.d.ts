import { Scheduler, Task, ScheduledTask, Timeline, Timer, Time, Clock, Delay, Period, Offset } from '@most/types';

export function newScheduler (timer: Timer, timeline: Timeline): Scheduler;
export function newScheduler (timer: Timer): (timeline: Timeline) => Scheduler;

export function newDefaultScheduler (): Scheduler;

export function schedulerRelativeTo (offset: Offset, scheduler: Scheduler): Scheduler
export function schedulerRelativeTo (offset: Offset): (scheduler: Scheduler) => Scheduler

export function newClockTimer (clock: Clock): Timer;
export function newTimeline (): Timeline;

export function newPlatformClock (): Clock;
export function newPerformanceClock (): Clock;
export function newDateClock (): Clock;
export function newHRTimeClock (): Clock;

export function clockRelativeTo (clock: Clock): Clock;

export function currentTime (scheduler: Scheduler): Time

export function asap (task: Task, scheduler: Scheduler): ScheduledTask;
export function asap (task: Task): (scheduler: Scheduler) => ScheduledTask;

export function delay (delay: Delay, task: Task, scheduler: Scheduler): ScheduledTask;
export function delay (delay: Delay): (task: Task, scheduler: Scheduler) => ScheduledTask;
export function delay (delay: Delay, task: Task): (scheduler: Scheduler) => ScheduledTask;
export function delay (delay: Delay): (task: Task) => (scheduler: Scheduler) => ScheduledTask;

export function periodic (period: Period, task: Task, scheduler: Scheduler): ScheduledTask;
export function periodic (period: Period): (task: Task, scheduler: Scheduler) => ScheduledTask;
export function periodic (period: Period, task: Task): (scheduler: Scheduler) => ScheduledTask;
export function periodic (period: Period): (task: Task) => (scheduler: Scheduler) => ScheduledTask;

export function cancelTask (scheduledTask: ScheduledTask): void

export function cancelAllTasks (predicate: (scheduledTask: ScheduledTask) => boolean, scheduler: Scheduler): void
export function cancelAllTasks (predicate: (scheduledTask: ScheduledTask) => boolean): (scheduler: Scheduler) => void
