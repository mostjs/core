// @flow
import { combine, map, runEffects, startWith, tap } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { input } from '@most/dom-event'
import { qs } from '../../common'

// Display the result of adding two inputs.
// The result is reactive and updates whenever *either* input changes.

const add = (x, y) => x + y
const toNumber = e => Number(e.target.value || 0)
const renderResult = result => { resultNode.textContent = result }

const xInput = qs('input.x', document)
const yInput = qs('input.y', document)
const resultNode = qs('.result', document)

// x represents the current value of xInput
const x = startWith(0, map(toNumber, input(xInput)))

// y represents the current value of yInput
const y = startWith(0, map(toNumber, input(yInput)))

// result is the live current value of adding x and y
const result = combine(add, x, y)

// render the result
const outputEffects = tap(renderResult, result)

// Run the app
runEffects(outputEffects, newDefaultScheduler())
