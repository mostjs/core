export interface Stream<A> {
  run (sink: Sink<A>, scheduler: Scheduler): Disposable;
}

export interface Sink<A> {
  event(time: number, value: A): void;
  end(time: number, value?: A): void;
  error(time: number, err: Error): void;
}

export interface Scheduler {
  now(): number;
  asap(task: Task): ScheduledTask;
  delay(task: Task): ScheduledTask;
  periodic(task: Task): ScheduledTask;
  schedule(delay: number, period: number, task: Task): ScheduledTask;
  cancel(task: ScheduledTask): void;
  cancelAll(predicate: (task: ScheduledTask) => boolean): void;
}

export interface Timer {
  now(): number;
  setTimer(f: () => any, delayTime: number): number;
  clearTimer(taskId: number): void;
}

export interface Timeline {
  nextArrival(): number;
  isEmpty(): boolean;
  add(scheduledTask: ScheduledTask): void;
  remove(scheduledTask: ScheduledTask): boolean;
  removeAll(f: (scheduledTask: ScheduledTask) => boolean): void;
  runTasks(time: number, runTask: (task: ScheduledTask) => any): void;
}

export interface Task {
  run(time: number): void;
  error(time: number, e: Error): void;
  dispose(): void;
}

export interface ScheduledTask {
  task: Task;
  run(): void;
  error(err: Error): void;
  dispose(): void;
}

export interface Disposable {
  dispose(): void | Promise<any>;
}

export type SeedValue<S, V> = { seed: S, value: V };
