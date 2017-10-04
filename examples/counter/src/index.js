// @flow
import { constant, scan, merge, tap, runEffects } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { click } from '@most/dom-event'

const fail = s => { throw new Error(s) }
const qs = (s) => document.querySelector(s) || fail(`${s} not found`)

const incButton = qs('[name=inc]')
const decButton = qs('[name=dec]')
const value = qs('.value')

const inc = constant(1, click(incButton))
const dec = constant(-1, click(decButton))

const counter = scan((total, delta) => total + delta, 0, merge(inc, dec))

const render = tap(total => { value.innerText = String(total) }, counter)

runEffects(render, newDefaultScheduler())
