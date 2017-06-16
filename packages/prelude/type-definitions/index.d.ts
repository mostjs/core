// array.js
export function cons<A>(val: A, arr: A[]): A[];

export function append<A>(val: A, arr: A[]): A[];

export function drop<A>(val: number, arr: A[]): A[];

export function tail<A>(arr: A[]): A[];

export function copy<A>(arr: A[]): A[];

export function map<A, B>(f: (val: A) => B, arr: A[]): B[];

export function reduce<A, B>(f: (acc: A, val: B) => A, seed: A, arr: B[]): A

export function replace<A>(toReplace: A, i: number, arr: A[]): A[];

export function remove<A>(i: number, arr: A[]): A[];

export function removeAll<A>(f: (val: A) => boolean, arr: A[]): A[];

export function findIndex<A>(item: A, arr: A[]): number;

export function isArrayLike(x: any): boolean;

// function.js

export function id<A>(x: A): A;

export function compose<A, B, C>(f: (val: B) => C, g: (val: A) => B): (val: A) => C;

export function apply<A, B>(f: (val: A) => B, x: A): B;

interface CurriedFunction2<A, B, C> {
  (): CurriedFunction2<A, B, C>;
  (a: A): (b: B) => C;
  (a: A, b: B): C;
}

interface CurriedFunction3<A, B, C, D> {
  (): CurriedFunction3<A, B, C, D>;
  (a: A): CurriedFunction2<B, C, D>;
  (a: A, b: B): (c: C) => D;
  (a: A, b: B, c: C): D;
}

interface CurriedFunction4<A, B, C, D, E> {
  (): CurriedFunction4<A, B, C, D, E>;
  (a: A): CurriedFunction3<B, C, D, E>;
  (a: A, b: B): CurriedFunction2<C, D, E>;
  (a: A, b: B, c: C): (d: D) => E;
  (a: A, b: B, c: C, d: D): E;
}

export function curry2<A, B, C>(f: (a: A, b: B) => C): CurriedFunction2<A, B, C>;

export function curry3<A, B, C, D>(f: (a: A, b: B, c: C) => D): CurriedFunction3<A, B, C, D>;

export function curry4<A, B, C, D, E>(f: (a: A, b: B, c: C, d: D) => E): CurriedFunction4<A, B, C, D, E>;
