export const never = () => new Infinite([], Infinity)

export const empty = () => new Finite([], 0)

export const finite = (events, time) => new Finite(events, time)

export const infinite = (events, time) => new Infinite(events, time)

export const errored = (e, events, time) => new Errored(e, events, time)

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
