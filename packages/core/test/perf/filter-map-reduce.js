require('babel-register')
const Benchmark = require('benchmark')
const { map, filter } = require('../../src/index')
const { reduce } = require('../helper/reduce')
const rx = require('rxjs')
const rxo = require('rxjs/operators')
const bacon = require('baconjs')
const highland = require('highland')
const xs = require('xstream').default

const { getIntArg, runSuite, kefirFromArray, mostFromArray, runMost, runRx6, runXstream, runKefir, runBacon, runHighland } = require('./runners')

// Create a stream from an Array of n integers
// filter out odds, map remaining evens by adding 1, then reduce by summing
const n = getIntArg(1000000)
const a = new Array(n)
for (let i = 0; i < a.length; ++i) {
  a[i] = i
}

const suite = Benchmark.Suite('filter -> map -> reduce ' + n + ' integers')
const options = {
  defer: true,
  onError: function (e) {
    e.currentTarget.failure = e.error
  }
}

suite
  .add('most', function (deferred) {
    runMost(deferred, reduce(sum, 0, map(add1, filter(even, mostFromArray(a)))))
  }, options)
  .add('rx 6', function (deferred) {
    runRx6(deferred,
      rx.from(a).pipe(rxo.filter(even), rxo.map(add1), rxo.reduce(sum, 0)))
  }, options)
  .add('xstream', function (deferred) {
    runXstream(deferred, xs.fromArray(a).filter(even).map(add1).fold(sum, 0).last())
  }, options)
  .add('kefir', function (deferred) {
    runKefir(deferred, kefirFromArray(a).filter(even).map(add1).scan(sum, 0).last())
  }, options)
  .add('bacon', function (deferred) {
    runBacon(deferred, bacon.fromArray(a).filter(even).map(add1).reduce(0, sum))
  }, options)
  .add('highland', function (deferred) {
    runHighland(deferred, highland(a).filter(even).map(add1).reduce(0, sum))
  }, options)

runSuite(suite)

function add1 (x) {
  return x + 1
}

function even (x) {
  return x % 2 === 0
}

function sum (x, y) {
  return x + y
}
