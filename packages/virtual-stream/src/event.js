export const at = (time, value) =>
  new Event(time, value)

export class Event {
  constructor (time, value) {
    this.time = time
    this.value = value
  }
}
