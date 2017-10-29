// @flow
import { constant, scan, merge, tap, runEffects } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { click } from '@most/dom-event'
import { qs } from '../../common'

const incButton = qs('[name=inc]', document)
const decButton = qs('[name=dec]', document)
const value = qs('.value', document)

const inc = constant(1, click(incButton))
const dec = constant(-1, click(decButton))

const counter = scan((total, delta) => total + delta, 0, merge(inc, dec))

const render = tap(total => { value.innerText = String(total) }, counter)

runEffects(render, newDefaultScheduler())
