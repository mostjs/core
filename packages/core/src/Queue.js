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

export default class Queue {
  constructor () {
    this._head = 0
    this._tail = 0
    this._capacityMask = 0x3
    this._list = new Array(4)
  }

  push (x) {
    const tail = this._tail
    this._list[tail] = x
    this._tail = (tail + 1) & this._capacityMask
    if (this._tail === this._head) {
      this._growArray()
    }

    if (this._head < this._tail) {
      return this._tail - this._head
    } else {
      return this._capacityMask + 1 - (this._head - this._tail)
    }
  }

  shift () {
    const head = this._head
    if (head === this._tail) {
      return undefined
    }

    const x = this._list[head]
    this._list[head] = undefined
    this._head = (head + 1) & this._capacityMask
    if (head < HEAD_MAX_SHRINK &&
      this._tail > TAIL_MIN_SHRINK &&
      this._tail <= this._list.length >>> 2) {
      this._shrinkArray()
    }

    return x
  }

  isEmpty () {
    return this._head === this._tail
  }

  length () {
    if (this._head === this._tail) {
      return 0
    } else if (this._head < this._tail) {
      return this._tail - this._head
    } else {
      return this._capacityMask + 1 - (this._head - this._tail)
    }
  }

  _growArray () {
    if (this._head) {
      // copy existing data, head to end, then beginning to tail.
      this._list = this._copyArray()
      this._head = 0
    }

    // head is at 0 and array is now full, safe to extend
    this._tail = this._list.length

    this._list.length *= 2
    this._capacityMask = (this._capacityMask << 1) | 1
  }

  _shrinkArray () {
    this._list.length >>>= 1
    this._capacityMask >>>= 1
  }

  _copyArray () {
    const newArray = []
    const list = this._list
    const len = list.length

    let i
    for (i = this._head; i < len; i++) {
      newArray.push(list[i])
    }
    for (i = 0; i < this._tail; i++) {
      newArray.push(list[i])
    }

    return newArray
  }
}
