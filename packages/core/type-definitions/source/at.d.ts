import { Time, Stream } from '@most/types';

export function at<A>(t: Time, a: A): Stream<A>;
export function at<A>(t: Time): (a: A) => Stream<A>;
