import { Sink, Task } from './types';

export class PropagateTask<T> implements Task {
  protected _run: (time: number, value: T, sink: Sink<T>) => any;
  protected value: T;
  protected sink: Sink<T>;
  protected active: boolean;

  constructor(run: (time: number, value: T, sink: Sink<T>) => any, value: T, sink: Sink<T>);

  public static event<T>(value: T, sink: Sink<T>): PropagateTask<T>;
  public static error(error: Error, sink: Sink<any>): PropagateTask<any>;
  public static end<T>(value: T, sink: Sink<T>): PropagateTask<T>;

  public run(time: number): void;
  public error(time: number, e: Error): void;
  public dispose(): void;
}
