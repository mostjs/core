import { Disposable, Scheduler, Sink, Stream, Time } from '@most/types';

export function multicast<A>(s: Stream<A>): Stream<A>;

export class MulticastSource<A> implements Stream<A>, Sink<A> {
  protected source: Stream<A>;
  protected sinks: Array<Sink<A>>;
  protected _disposable: Disposable;

  constructor(source: Stream<A>);

  public run(sink: Sink<A>, scheduler: Scheduler): Disposable;

  public event(time: Time, value: A): void;
  public error(time: Time, error: Error): void;
  public end(time: Time): void;

  protected add(sink: Sink<A>): number;
  protected remove(sink: Sink<A>): number;
}
