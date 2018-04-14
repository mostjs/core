/** @license MIT License (c) copyright 2018 original author or authors */

export const noop = () => undefined

export const bind = (fn, object) => fn.bind(object)
