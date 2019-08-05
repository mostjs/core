/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { Disposable } from '@most/types' // eslint-disable-line no-unused-vars

export const dispose = (disposable: Disposable): void =>
  disposable.dispose()
