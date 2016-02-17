/** @license MIT License (c) copyright 2010-2016 original author or authors */

// id :: a -> a
export const id = x => x;

// compose :: (b -> c) -> (a -> b) -> (a -> c)
export const compose = (f, g) => x => f(g(x));

// apply :: (a -> b) -> a -> b
export const apply = (f, x) => f(x);
