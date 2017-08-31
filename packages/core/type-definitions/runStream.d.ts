import { Sink, Scheduler, Stream } from '@most/types';

export function runStream <A> (sink: Sink<A>, scheduler: Scheduler, s: Stream<A>)
