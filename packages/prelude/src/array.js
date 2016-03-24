/** @license MIT License (c) copyright 2010-2016 original author or authors */

// Non-mutating array operations

// cons :: a -> [a] -> [a]
// a with x prepended
export function cons (x, a) {
  const l = a.length
  const b = new Array(l + 1)
  b[0] = x
  for (let i = 0; i < l; ++i) {
    b[i + 1] = a[i]
  }
  return b
}

// append :: a -> [a] -> [a]
// a with x appended
export function append (x, a) {
  const l = a.length
  const b = new Array(l + 1)
  for (let i = 0; i < l; ++i) {
    b[i] = a[i]
  }

  b[l] = x
  return b
}

// drop :: Int -> [a] -> [a]
// drop first n elements
export function drop (n, a) { // eslint-disable-line complexity
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

// unsafeDrop :: Int -> [a] -> Int -> [a]
// Internal helper for drop
function unsafeDrop (n, a, l) {
  const b = new Array(l)
  for (let i = 0; i < l; ++i) {
    b[i] = a[n + i]
  }
  return b
}

// tail :: [a] -> [a]
// drop head element
export function tail (a) {
  return drop(1, a)
}

// copy :: [a] -> [a]
// duplicate a (shallow duplication)
export function copy (a) {
  const l = a.length
  const b = new Array(l)
  for (let i = 0; i < l; ++i) {
    b[i] = a[i]
  }
  return b
}

// map :: (a -> b) -> [a] -> [b]
// transform each element with f
export function map (f, a) {
  const l = a.length
  const b = new Array(l)
  for (let i = 0; i < l; ++i) {
    b[i] = f(a[i])
  }
  return b
}

// reduce :: (a -> b -> a) -> a -> [b] -> a
// accumulate via left-fold
export function reduce (f, z, a) {
  let r = z
  for (let i = 0, l = a.length; i < l; ++i) {
    r = f(r, a[i], i)
  }
  return r
}

// replace :: a -> Int -> [a]
// replace element at index
export function replace (x, i, a) { // eslint-disable-line complexity
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

// remove :: Int -> [a] -> [a]
// remove element at index
export function remove (i, a) {  // eslint-disable-line complexity
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

// unsafeRemove :: Int -> [a] -> Int -> [a]
// Internal helper to remove element at index
function unsafeRemove (i, a, l) {
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

// removeAll :: (a -> boolean) -> [a] -> [a]
// remove all elements matching a predicate
export function removeAll (f, a) {
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

// findIndex :: a -> [a] -> Int
// find index of x in a, from the left
export function findIndex (x, a) {
  for (let i = 0, l = a.length; i < l; ++i) {
    if (x === a[i]) {
      return i
    }
  }
  return -1
}

// isArrayLike :: * -> boolean
// Return true iff x is array-like
export function isArrayLike (x) {
  return x != null && typeof x.length === 'number' && typeof x !== 'function'
}
