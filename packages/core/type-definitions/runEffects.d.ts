import { Scheduler, Stream } from '@most/types';

export function runEffects <T> (stream: Stream<T>, scheduler: Scheduler): Promise<void>;
export function runEffects <T> (stream: Stream<T>): (scheduler: Scheduler) => Promise<void>;
