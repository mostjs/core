```
________________________________
___   |/  /_  __ \_  ___/__  __/
__  /|_/ /_  / / /____ \__  /   
_  /  / / / /_/ /____/ /_  /    
/_/  /_/  \____/______/ /_/
```

# Monadic Event Stream

[![Build Status](https://travis-ci.org/mostjs/core.svg?branch=master)](https://travis-ci.org/cujojs/most)
[![Join the chat at https://gitter.im/cujojs/most](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/cujojs/most?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The high-performance reactive event stream core that powers [Most](https://github.com/cujojs/most).

Specifically, `@most/core` features Most's battle-tested, high-performance architecture with a lean, functions-only, *curried* API in a *tree-shakeable* package.

## Get it

```
npm install --save @most/core
```

## Simple example

Here's a simple program that displays the result of adding two inputs.  The result is reactive and updates whenever *either* input changes.

First, the HTML fragment for the inputs and a place to display the live result:

```html
<form>
	<input class="x"> + <input class="y"> = <span class="result"></span>
</form>
```

Using `@most/core` to make it reactive:

```es6
import { combine, runEffects, createDefaultScheduler } from '@most/core'
import { input } from '@most/dom-event'

const xInput = document.querySelector('input.x')
const yInput = document.querySelector('input.y')
const resultNode = document.querySelector('.result')

const add = (x, y) => x + y

const toNumber = e => Number(e.target.value)

const renderResult = result => {
  resultNode.textContent = result
}

// x represents the current value of xInput,
// updated on 'input' events
const x = map(toNumber, input(xInput))

// y represents the current value of yInput,
// updated on 'input' events
const y = map(toNumber, input(yInput))

// result is the live current value of adding x and y
// also updated on 'input' events from either
// xInput or yInput
const result = combine(add, x, y)

// Side effect to update the DOM
const update = tap(renderResult, result)

// Observe the result, causing the DOM to be updated
runEffects(update, createDefaultScheduler())
```
