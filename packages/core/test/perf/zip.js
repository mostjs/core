const Benchmark = require('benchmark')
const { zip } = require('../../src')
const { reduce } = require('../helper/reduce')
const rx = require('rxjs')
const rxo = require('rxjs/operators')
const bacon = require('baconjs')
const highland = require('highland')

const { getIntArg, runSuite, kefirFromArray, mostFromArray, runMost, runRx6, runKefir, runBacon, runHighland } = require('./runners')

// Create 2 streams, each with n items, zip them by summing the
// corresponding index pairs, then reduce the resulting stream by summing
const n = getIntArg(100000)
const a = new Array(n)
const b = new Array(n)

for (let i = 0; i < n; ++i) {
  a[i] = i
  b[i] = i
}

const suite = Benchmark.Suite('zip 2 x ' + n + ' integers')
const options = {
  defer: true,
  onError: function (e) {
    e.currentTarget.failure = e.error
  }
}

suite
  .add('most', function (deferred) {
    runMost(deferred, reduce(add, 0, zip(add, mostFromArray(a), mostFromArray(b))))
  }, options)
  .add('rx 6', function (deferred) {
    runRx6(deferred, rx.from(a).pipe(rxo.zip(rx.from(b), add)).pipe(rxo.reduce(add, 0)))
  }, options)
  .add('kefir', function (deferred) {
    runKefir(deferred, kefirFromArray(a).zip(kefirFromArray(b), add).scan(add, 0).last())
  }, options)
  .add('bacon', function (deferred) {
    runBacon(deferred, bacon.zipWith(add, bacon.fromArray(a), bacon.fromArray(b)).reduce(0, add))
  }, options)
  .add('highland', function (deferred) {
    runHighland(deferred, highland(a).zip(highland(b)).map(addPair).reduce(0, add))
  }, options)
  // There is no zip in xstream

runSuite(suite)

function addPair (pair) {
  return pair[0] + pair[1]
}

function add (a, b) {
  return a + b
}
