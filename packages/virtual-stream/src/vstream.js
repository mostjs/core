// never :: () -> VirtualStream t e a
export const never = () => new Infinite([], Infinity)

// empty :: () -> VirtualStream t e a
export const empty = () => new Finite([], 0)

// vstream :: Iterable (Event t a) -> t -> VirtualStream t e a
export const vstream = (events, time) => new Finite(events, time)

// infinite :: VirtualStream t e a -> VirtualStream t e a
export const infinite = vstream => new Infinite(vstream.events, vstream.time)

// errored :: VirtualStream t e a -> VirtualStream t e a
export const errored = (e, vstream) => new Errored(e, vstream.events, vstream.time)

// data VirtualStream t e a where
//   Finite :: Iterable (Event t a) -> t -> VirtualStream t e a
//   Infinite :: Iterable (Event t a) -> t -> VirtualStream t e a
//   Errored :: Error e => e -> Iterable (Event t a) -> t -> VirtualStream t e a
export class Finite {
  constructor (events, time) {
    this.events = events
    this.time = time
  }
}

export class Infinite {
  constructor (events, time) {
    this.events = events
    this.time = time
  }
}

export class Errored {
  constructor (error, events, time) {
    this.events = events
    this.time = time
    this.error = error
  }
}
