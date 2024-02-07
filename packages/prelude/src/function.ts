/** @license MIT License (c) copyright 2010-2016 original author or authors */

export const id = <A>(x: A): A => x

export const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (x: A): C => f(g(x))

export const flow = (input: any, ...fns: [(x: any) => any]): any =>
  fns.reduce((val, fn) => fn(val), input)

export const apply = <A, B>(f: (a: A) => B, x: A): B => f(x)

export interface Curried2<A, B, C> {
  (): Curried2<A, B, C>
  (a: A, b: B): C
  (a: A): (b: B) => C
}

export function curry2 <A, B, C>(f: (a: A, b: B) => C): Curried2<A, B, C> {
  function curried(a: A, b: B): any {
    switch (arguments.length) {
      case 0: return curried
      case 1: return (b: B) => f(a, b)
      default: return f(a, b)
    }
  }
  return curried as any
}

export interface Curried3<A, B, C, D> {
  (): Curried3<A, B, C, D>
  (a: A): Curried2<B, C, D>
  (a: A, b: B): (c: C) => D
  (a: A, b: B, c: C): D
}

export function curry3 <A, B, C, D>(f: (a: A, b: B, c: C) => D): Curried3<A, B, C, D> {
  function curried(a: A, b: B, c: C): any {
    switch (arguments.length) {
      case 0: return curried
      case 1: return curry2((b: B, c: C) => f(a, b, c))
      case 2: return (c: C) => f(a, b, c)
      default:return f(a, b, c)
    }
  }
  return curried as any
}

export interface Curried4<A, B, C, D, E> {
  (): Curried4<A, B, C, D, E>
  (a: A): Curried3<B, C, D, E>
  (a: A, b: B): Curried2<C, D, E>
  (a: A, b: B, c: C): (d: D) => E
  (a: A, b: B, c: C, d: D): E
}

export function curry4 <A, B, C, D, E>(f: (a: A, b: B, c: C, d: D) => E): Curried4<A, B, C, D, E> {
  function curried(a: A, b: B, c: C, d: D): any {
    switch (arguments.length) {
      case 0: return curried
      case 1: return curry3((b: B, c: C, d: D) => f(a, b, c, d))
      case 2: return curry2((c: C, d: D) => f(a, b, c, d))
      case 3: return (d: D) => f(a, b, c, d)
      default:return f(a, b, c, d)
    }
  }
  return curried as any
}
