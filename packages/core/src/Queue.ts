// Copied and modified from https://github.com/invertase/denque
// MIT License

// These constants were extracted directly from denque's shift()
// It's not clear exactly why the authors chose these particular
// values, but given denque's stated goals, it seems likely that
// they were chosen for speed/memory reasons.

// Max value of _head at which Queue is willing to shink
// its internal array
const HEAD_MAX_SHRINK = 2

// Min value of _tail at which Queue is willing to shink
// its internal array
const TAIL_MIN_SHRINK = 10000

export default class Queue<A> {
  private head: number;
  private tail: number;
  private capacityMask: number;
  private list: Array<A | undefined>;

  constructor () {
    this.head = 0
    this.tail = 0
    this.capacityMask = 0x3
    this.list = new Array(4)
  }

  push (x: A): number {
    const tail = this.tail
    this.list[tail] = x
    this.tail = (tail + 1) & this.capacityMask
    if (this.tail === this.head) {
      this.growArray()
    }

    if (this.head < this.tail) {
      return this.tail - this.head
    } else {
      return this.capacityMask + 1 - (this.head - this.tail)
    }
  }

  shift (): A | undefined {
    const head = this.head
    if (head === this.tail) {
      return undefined
    }

    const x = this.list[head]
    this.list[head] = undefined
    this.head = (head + 1) & this.capacityMask
    if (head < HEAD_MAX_SHRINK &&
      this.tail > TAIL_MIN_SHRINK &&
      this.tail <= this.list.length >>> 2) {
      this.shrinkArray()
    }

    return x
  }

  isEmpty (): boolean {
    return this.head === this.tail
  }

  length (): number {
    if (this.head === this.tail) {
      return 0
    } else if (this.head < this.tail) {
      return this.tail - this.head
    } else {
      return this.capacityMask + 1 - (this.head - this.tail)
    }
  }

  private growArray (): void {
    if (this.head) {
      // copy existing data, head to end, then beginning to tail.
      this.list = this.copyArray()
      this.head = 0
    }

    // head is at 0 and array is now full, safe to extend
    this.tail = this.list.length

    this.list.length *= 2
    this.capacityMask = (this.capacityMask << 1) | 1
  }

  private shrinkArray (): void {
    this.list.length >>>= 1
    this.capacityMask >>>= 1
  }

  private copyArray (): Array<A | undefined> {
    const newArray = []
    const list = this.list
    const len = list.length

    let i
    for (i = this.head; i < len; i++) {
      newArray.push(list[i])
    }
    for (i = 0; i < this.tail; i++) {
      newArray.push(list[i])
    }

    return newArray
  }
}
