require('babel-register')
const Benchmark = require('benchmark')
const { concatMap } = require('../../src/index')
const { reduce } = require('../helper/reduce')
const rx = require('rxjs')
const rxo = require('rxjs/operators')
const bacon = require('baconjs')
const xs = require('xstream').default

const { getIntArg2, runSuite, kefirFromArray, mostFromArray, runMost, runRx6, runXstream, runKefir, runBacon } = require('./runners')

const xstreamFlattenSequentially = require('xstream/extra/flattenSequentially').default

// flatMapping n streams, each containing m items.
// Results in a single stream that merges in m x n items
// In Array parlance: Take an Array containing m Arrays, each of length n,
// and flatten it to an Array of length m x n.
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

const suite = Benchmark.Suite('concatMap ' + mn[0] + ' x ' + mn[1] + ' streams')
const options = {
  defer: true,
  onError: function (e) {
    e.currentTarget.failure = e.error
  }
}

suite
  .add('most', function (deferred) {
    runMost(deferred, reduce(sum, 0, concatMap(mostFromArray, mostFromArray(a))))
  }, options)
  .add('rx 6', function (deferred) {
    runRx6(deferred, rx.from(a).pipe(rxo.concatMap(x => rx.from(x))).pipe(rxo.reduce(sum, 0)))
  }, options)
  .add('xstream', function (deferred) {
    runXstream(deferred, xs.fromArray(a).map(xs.fromArray).compose(xstreamFlattenSequentially).fold(sum, 0).last())
  }, options)
  .add('kefir', function (deferred) {
    runKefir(deferred, kefirFromArray(a).flatMapConcat(kefirFromArray).scan(sum, 0).last())
  }, options)
  .add('bacon', function (deferred) {
    runBacon(deferred, bacon.fromArray(a).flatMapConcat(bacon.fromArray).reduce(0, sum))
  }, options)
  // Highland doesn't have concatMap
  // .add('highland', function (deferred) {
  //   runHighland(deferred, highland (a).flatMap (highland).reduce(0, sum))
  // }, options)

runSuite(suite)

function sum (x, y) {
  return x + y
}
