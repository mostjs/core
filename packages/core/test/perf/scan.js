require('babel-register')
const Benchmark = require('benchmark')
const { scan } = require('../../src/index')
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

const suite = Benchmark.Suite('scan -> reduce ' + n + ' integers')
const options = {
  defer: true,
  onError: function (e) {
    e.currentTarget.failure = e.error
  }
}

suite
  .add('most', function (deferred) {
    runMost(deferred, reduce(passthrough, 0, scan(sum, 0, mostFromArray(a))))
  }, options)
  .add('rx 6', function (deferred) {
    runRx6(deferred, rx.from(a).pipe(rxo.scan(sum, 0)).pipe(rxo.reduce(passthrough, 0)))
  }, options)
  .add('xstream', function (deferred) {
    runXstream(deferred, xs.fromArray(a).fold(sum, 0).fold(passthrough, 0).last())
  }, options)
  .add('kefir', function (deferred) {
    runKefir(deferred, kefirFromArray(a).scan(sum, 0).scan(passthrough, 0).last())
  }, options)
  .add('bacon', function (deferred) {
    runBacon(deferred, bacon.fromArray(a).scan(0, sum).reduce(0, passthrough))
  }, options)
  .add('highland', function (deferred) {
    runHighland(deferred, highland(a).scan(0, sum).reduce(0, passthrough))
  }, options)

runSuite(suite)

function sum (x, y) {
  return x + y
}

function passthrough (z, x) {
  return x
}
