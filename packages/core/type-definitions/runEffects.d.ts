import { Scheduler, Stream } from './types';

export function runEffects(stream: Stream<any>, scheduler: Scheduler): Promise<any>;
export function runEffects(stream: Stream<any>): (scheduler: Scheduler) => Promise<any>;
