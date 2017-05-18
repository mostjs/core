// smart constructors
// at :: t -> a -> Event t a
export const at = (time, value) => new Event(time, value)

// data Event t a = Event t a
export class Event {
  constructor (time, value) {
    this.time = time
    this.value = value
  }
}
