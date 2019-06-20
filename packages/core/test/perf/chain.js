require('babel-register')
const Benchmark = require('benchmark')
const { chain } = require('../../src/index')
const { reduce } = require('../helper/reduce')
const rx = require('rxjs')
const rxo = require('rxjs/operators')
const kefir = require('kefir')
const bacon = require('baconjs')
const highland = require('highland')
const xs = require('xstream').default

const { getIntArg2, runSuite, kefirFromArray, mostFromArray, runMost, runRx6, runXstream, runKefir, runBacon, runHighland } = require('./runners')
const xstreamFlattenConcurrently = require('xstream/extra/flattenConcurrently').default

// flatMapping n streams, each containing m items.
// Results in a single stream that merges in n x m items
// In Array parlance: Take an Array containing n Arrays, each of length m,
// and flatten it to an Array of length n x m.
const mn = getIntArg2(1000, 1000)
const a = build(mn[0], mn[1])

function build (m, n) {
  const a = new Array(n)
  for (let i = 0; i < a.length; ++i) {
    a[i] = buildArray(i * 1000, m)
  }
  return a
}

function buildArray (base, n) {
  const a = new Array(n)
  for (let i = 0; i < a.length; ++i) {
    a[i] = base + i
  }
  return a
}

const suite = Benchmark.Suite('chain ' + mn[0] + ' x ' + mn[1] + ' streams')
const options = {
  defer: true,
  onError: function (e) {
    e.currentTarget.failure = e.error
  }
}

suite
  .add('most', function (deferred) {
    runMost(deferred, reduce(sum, 0, chain(mostFromArray, mostFromArray(a))))
  }, options)
  .add('rx 6', function (deferred) {
    runRx6(deferred,
      rx.from(a).pipe(rxo.flatMap(function (x) { return rx.from(x) })).pipe(rxo.reduce(sum, 0)))
  }, options)
  .add('xstream', function (deferred) {
    runXstream(deferred, xs.fromArray(a).map(xs.fromArray).compose(xstreamFlattenConcurrently).fold(sum, 0).last())
  }, options)
  .add('kefir', function (deferred) {
    runKefir(deferred, kefirFromArray(a).flatMap(kefirFromArray).scan(sum, 0).last())
  }, options)
  .add('bacon', function (deferred) {
    runBacon(deferred, bacon.fromArray(a).flatMap(bacon.fromArray).reduce(0, sum))
  }, options)
  .add('highland', function (deferred) {
    runHighland(deferred, highland(a).flatMap(highland).reduce(0, sum))
  }, options)

runSuite(suite)

function sum (x, y) {
  return x + y
}
