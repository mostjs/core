import { curry3 } from '@most/prelude'

export const runStream = curry3((sink, scheduler, stream) =>
    stream.run(sink, scheduler))
