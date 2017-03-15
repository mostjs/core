import { Stream } from '@most/types';

export function generate<A>(g: GeneratorFunction, ...args: Array<any>): Stream<A>;
