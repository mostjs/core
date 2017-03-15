import { Scheduler, Stream } from '@most/types';

export function runEffects(stream: Stream<any>, scheduler: Scheduler): Promise<any>;
export function runEffects(stream: Stream<any>): (scheduler: Scheduler) => Promise<any>;
