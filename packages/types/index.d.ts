// An instant in time.  This can be wall-clock time
// or a virtual time, depending on the particular Scheduler
// in use
export type Time = number;

// A Clock represents a source of the current time
export type Clock = {
  now (): Time;
}

export interface Stream<A> {
  run (sink: Sink<A>, scheduler: Scheduler): Disposable;
}

export interface Sink<A> {
  event(time: Time, value: A): void;
  end(time: Time): void;
  error(time: Time, err: Error): void;
}

// Interface of a resource that can be disposed
export interface Disposable {
  dispose(): void;
}

// Delay time offset
export type Delay = number;

// Span of time between time instants
export type Period = number;

// Relative offset between two clocks / schedulers
export type Offset = number

export interface Scheduler {
  currentTime(): Time;
  scheduleTask (offset: Offset, delay: Delay, period: Period, task: Task): ScheduledTask;
  relative(offset: Offset): Scheduler;
  cancel(task: ScheduledTask): void;
  cancelAll(predicate: (task: ScheduledTask) => boolean): void;
}

// Opaque handle vended by some platform-specific functions,
// like setTimeout.
export type Handle = any;

export interface Timer {
  now(): Time;
  setTimer(f: () => any, delayTime: Delay): Handle;
  clearTimer(timerHandle: Handle): void;
}

// Run a ScheduledTask
export type TaskRunner = (st: ScheduledTask) => any;

export interface Timeline {
  add(scheduledTask: ScheduledTask): void;
  remove(scheduledTask: ScheduledTask): boolean;
  removeAll(f: (scheduledTask: ScheduledTask) => boolean): void;
  isEmpty(): boolean;
  nextArrival(): Time;
  runTasks(time: Time, runTask: TaskRunner): void;
}

export interface Task {
  run(time: Time): void;
  error(time: Time, e: Error): void;
  dispose(): void;
}

export interface ScheduledTask {
  task: Task;
  run(): void;
  error(err: Error): void;
  dispose(): void;
}
