/** @license MIT License (c) copyright 2010-2016 original author or authors */

// Non-mutating array operations

/**
 * a with x prepended
 */
export function cons <A>(x: A, a: ArrayLike<A>): A[] {
  const l = a.length
  const b = new Array(l + 1)
  b[0] = x
  for (let i = 0; i < l; ++i) {
    b[i + 1] = a[i]
  }
  return b
}

/**
 * a with x appended
 */
export function append <A>(x: A, a: ArrayLike<A>): A[] {
  const l = a.length
  const b = new Array(l + 1)
  for (let i = 0; i < l; ++i) {
    b[i] = a[i]
  }

  b[l] = x
  return b
}

/**
 * Concats two `ArrayLike`s
 */
export function concat <A>(a: ArrayLike<A>, b: ArrayLike<A>): A[] {
  const al = a.length
  const bl = b.length
  const r = new Array(al + bl)
  let i = 0
  for (i = 0; i < al; i++) {
    r[i] = a[i]
  }
  for (let j = 0; j < bl; j++) {
    r[i++] = b[j]
  }
  return r
}

//
/**
 * drop first n elements
 */
export function drop <A>(n: number, a: A[]): A[] {
  if (n < 0) {
    throw new TypeError('n must be >= 0')
  }

  const l = a.length
  if (n === 0 || l === 0) {
    return a
  }

  if (n >= l) {
    return []
  }

  return unsafeDrop(n, a, l - n)
}

/**
 * Internal helper for drop
 */
function unsafeDrop <A>(n: number, a: ArrayLike<A>, l: number): A[] {
  const b = new Array(l)
  for (let i = 0; i < l; ++i) {
    b[i] = a[n + i]
  }
  return b
}

/**
 * drop head element
 */
export function tail <A>(a: A[]): A[] {
  return drop(1, a)
}

/**
 * duplicate a (shallow duplication)
 */
export function copy <A>(a: ArrayLike<A>): A[] {
  const l = a.length
  const b = new Array(l)
  for (let i = 0; i < l; ++i) {
    b[i] = a[i]
  }
  return b
}

/**
 * transform each element with f
 */
export function map <A, B>(f: (a: A) => B, a: ArrayLike<A>): B[] {
  const l = a.length
  const b = new Array(l)
  for (let i = 0; i < l; ++i) {
    b[i] = f(a[i])
  }
  return b
}

/**
 * accumulate via left-fold
 */
export function reduce <A, B>(f: (a: A, b: B, i: number) => A, z: A, a: ArrayLike<B>): A {
  let r = z
  for (let i = 0, l = a.length; i < l; ++i) {
    r = f(r, a[i], i)
  }
  return r
}

/**
 * replace element at index
 */
export function replace <A>(x: A, i: number, a: ArrayLike<A>): A[] {
  if (i < 0) {
    throw new TypeError('i must be >= 0')
  }

  const l = a.length
  const b = new Array(l)
  for (let j = 0; j < l; ++j) {
    b[j] = i === j ? x : a[j]
  }
  return b
}

/**
 * remove element at index
 * @throws
 */
export function remove <A>(i: number, a: A[]): A[] {
  if (i < 0) {
    throw new TypeError('i must be >= 0')
  }

  const l = a.length
  if (l === 0 || i >= l) { // exit early if index beyond end of array
    return a
  }

  if (l === 1) { // exit early if index in bounds and length === 1
    return []
  }

  return unsafeRemove(i, a, l - 1)
}

/**
 * Internal helper to remove element at index
 */
function unsafeRemove <A>(i: number, a: ArrayLike<A>, l: number): A[] {
  const b = new Array(l)
  let j
  for (j = 0; j < i; ++j) {
    b[j] = a[j]
  }
  for (j = i; j < l; ++j) {
    b[j] = a[j + 1]
  }

  return b
}

/**
 * remove all elements matching a predicate
 * @deprecated
 */
export function removeAll <A>(f: (a: A) => boolean, a: ArrayLike<A>): A[] {
  const l = a.length
  const b = new Array(l)
  let j = 0
  for (let x, i = 0; i < l; ++i) {
    x = a[i]
    if (!f(x)) {
      b[j] = x
      ++j
    }
  }

  b.length = j
  return b
}

/**
 * find index of x in a, from the left
 */
export function findIndex <A>(x: A, a: ArrayLike<A>): number {
  for (let i = 0, l = a.length; i < l; ++i) {
    if (x === a[i]) {
      return i
    }
  }
  return -1
}

/**
 * Return true iff x is array-like
 */
export function isArrayLike(x: any): x is ArrayLike<unknown> {
  return x != null && typeof x.length === 'number' && typeof x !== 'function'
}
