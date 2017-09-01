require('buba/register')
const Benchmark = require('benchmark')
const {fromArray, concatMap} = require('.././index')
const {reduce} = require('.././combinator/reduce')
const rx = require('rx')
const rxjs = require('@reactivex/rxjs')
const kefir = require('kefir')
const bacon = require('baconjs')
const xs = require('xstream').default

const runners = require('./runners')
const kefirFromArray = runners.kefirFromArray
const xstreamFlattenSequentially = require('xstream/extra/flattenSequentially').default

// flatMapping n streams, each containing m items.
// Results in a single stream that merges in m x n items
// In Array parlance: Take an Array containing m Arrays, each of length n,
// and flatten it to an Array of length m x n.
const mn = runners.getIntArg2(1000, 1000)
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
    runners.runMost(deferred, reduce(sum, 0, concatMap(fromArray, fromArray(a))))
  }, options)
  .add('rx 4', function (deferred) {
    runners.runRx(deferred, rx.Observable.fromArray(a).concatMap(rx.Observable.fromArray).reduce(sum, 0))
  }, options)
  .add('rx 5', function (deffered) {
    runners.runRx5(deffered, rxjs.Observable.from(a).concatMap(function (x) { return rxjs.Observable.from(x) }).reduce(sum, 0))
  }, options)
  .add('xstream', function (deferred) {
    runners.runXstream(deferred, xs.fromArray(a).map(xs.fromArray).compose(xstreamFlattenSequentially).fold(sum, 0).last())
  }, options)
  .add('kefir', function (deferred) {
    runners.runKefir(deferred, kefirFromArray(a).flatMapConcat(kefirFromArray).scan(sum, 0).last())
  }, options)
  .add('bacon', function (deferred) {
    runners.runBacon(deferred, bacon.fromArray(a).flatMapConcat(bacon.fromArray).reduce(0, sum))
  }, options)
  // Highland doesn't have concatMap
  // .add('highland', function(deferred) {
  //  runners.runHighland(deferred, highland(a).flatMap(highland).reduce(0, sum));
  // }, options);

runners.runSuite(suite)

function sum (x, y) {
  return x + y
}

function identity (x) {
  return x
}
