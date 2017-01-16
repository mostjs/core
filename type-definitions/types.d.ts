export interface Sink<A> {
  event(time: number, value: A): void;
  end(time: number, value?: A): void;
  error(time: number, err: Error): void;
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

export interface Scheduler {
  now(): number;
  asap(task: Task): ScheduledTask;
  delay(task: Task): ScheduledTask;
  periodic(task: Task): ScheduledTask;
  schedule(delay: number, period: number, task: Task): ScheduledTask;
  cancel(task: ScheduledTask): void;
  cancelAll(predicate: (task: ScheduledTask) => boolean): void;
}

export interface Disposable {
  dispose(): void | Promise<any>;
}

export interface Source<A> {
  run (sink: Sink<A>, scheduler: Scheduler): Disposable;
}

export interface Subscriber<A> {
  next(value: A): void;
  error(err: Error): void;
  complete(value?: A): void;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface Stream<A> {
  source: Source<A>;
}

export class Stream<A> {
  public source: Source<A>;
  constructor (source: Source<A>);
}