/** @license MIT License (c) copyright 2010 original author or authors */

// A slice Bounds type that narrows min values via accumulation
// and max values via Math.min.
// type Bounds = { min: number, max: number }
// Notes:
// 0 <= min <= max
// slice(min2, max2, slice(min1, max1, s)) ~ slice(min1 + min2, Math.min(max1, min1 + max2), s)
// A bounds has a 1d coord system with origin 0, extending to Infinity.  Both min and max
// are relative to the origin (0).  However, when merging bounds b1 and b2, we
// *interpret* b2 as being relative to b1, hence adding min1 to *both* min2 and max2.
// This essentially translates b2's coordinates back into origin coordinates
// as bounds are merged.

// Construct a constrained bounds
export const boundsFrom = (unsafeMin, unsafeMax) => {
  const min = Math.max(0, unsafeMin)
  const max = Math.max(min, unsafeMax)
  return { min, max }
}

export const minBounds = min =>
  boundsFrom(min, Infinity)

export const maxBounds = max =>
  boundsFrom(0, max)

// Combine 2 bounds by narrowing min and max
export const mergeBounds = (b1, b2) =>
  boundsFrom(b1.min + b2.min, Math.min(b1.max, b1.min + b2.max))

// Nil bounds excludes all slice indices
export const isNilBounds = b =>
  b.min >= b.max

// Infinite bounds includes all slice indices
export const isInfiniteBounds = b =>
  b.min <= 0 && b.max === Infinity
