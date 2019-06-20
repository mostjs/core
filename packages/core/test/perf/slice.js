require('babel-register')
const Benchmark = require('benchmark')
const { skip, take } = require('../../src/index')
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

const suite = Benchmark.Suite('skip(n/4) -> take(n/2) ' + n + ' integers')
const options = {
  defer: true,
  onError: function (e) {
    e.currentTarget.failure = e.error
  }
}

const s = n * 0.25
const t = n * 0.5

suite
  .add('most', function (deferred) {
    runMost(deferred, reduce(sum, 0, take(t, skip(s, mostFromArray(a)))))
  }, options)
  .add('rx 6', function (deferred) {
    runRx6(deferred,
      rx.from(a).pipe(rxo.skip(s)).pipe(rxo.take(t)).pipe(rxo.reduce(sum, 0)))
  }, options)
  .add('xstream', function (deferred) {
    runXstream(deferred, xs.fromArray(a).drop(s).take(t).fold(sum, 0).last())
  }, options)
  .add('kefir', function (deferred) {
    runKefir(deferred, kefirFromArray(a).skip(s).take(t).scan(sum, 0).last())
  }, options)
  .add('bacon', function (deferred) {
    runBacon(deferred, bacon.fromArray(a).skip(s).take(t).reduce(0, sum))
  }, options)
  .add('highland', function (deferred) {
    runHighland(deferred, highland(a).drop(s).take(t).reduce(0, sum))
  }, options)

runSuite(suite)

function sum (x, y) {
  return x + y
}
