/** @license MIT License (c) copyright 2010 original author or authors */

/**
 * Doubly linked list
 * @constructor
 */
export default class LinkedList {
  constructor () {
    this.head = null
    this.length = 0
  }

  /**
   * Add a node to the end of the list
   * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to add
   */
  add (x) {
    if (this.head !== null) {
      this.head.prev = x
      x.next = this.head
    }
    this.head = x
    ++this.length
  }

  /**
   * Remove the provided node from the list
   * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to remove
   */
  remove (x) {
    --this.length
    if (x === this.head) {
      this.head = this.head.next
    }
    if (x.next !== null) {
      x.next.prev = x.prev
      x.next = null
    }
    if (x.prev !== null) {
      x.prev.next = x.next
      x.prev = null
    }
  }

  /**
   * @returns {boolean} true iff there are no nodes in the list
   */
  isEmpty () {
    return this.length === 0
  }

  /**
   * Dispose all nodes
   * @returns {void}
   */
  dispose () {
    if (this.isEmpty()) {
      return
    }

    let head = this.head
    this.head = null
    this.length = 0

    while (head !== null) {
      head.dispose()
      head = head.next
    }
  }
}
