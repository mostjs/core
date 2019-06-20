require('babel-register')
const Benchmark = require('benchmark')
const { map, switchLatest } = require('../../src/index')
const { reduce } = require('../helper/reduce')
const rx = require('rxjs')
const rxo = require('rxjs/operators')
const bacon = require('baconjs')
const xs = require('xstream').default

const { getIntArg2, runSuite, kefirFromArray, mostFromArray, runMost, runRx6, runXstream, runKefir, runBacon } = require('./runners')

// Switching n streams, each containing m items.
// Because this creates streams from arrays, it ends up
// behaving like concatMap, but gives a sense of the
// relative overhead introduced by each lib's switching
// combinator.
const mn = getIntArg2(10000, 1000)
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

const suite = Benchmark.Suite('switch ' + mn[0] + ' x ' + mn[1] + ' streams')
const options = {
  defer: true,
  onError: function (e) {
    e.currentTarget.failure = e.error
  }
}

suite
  .add('most', function (deferred) {
    runMost(deferred, reduce(sum, 0, switchLatest(map(mostFromArray, mostFromArray(a)))))
  }, options)
  .add('rx 6', function (deferred) {
    runRx6(deferred,
      rx.from(a).pipe(rxo.switchMap(x => rx.from(x))).pipe(rxo.reduce(sum, 0)))
  }, options)
  .add('xstream', function (deferred) {
    runXstream(deferred, xs.fromArray(a).map(xs.fromArray).flatten().fold(sum, 0).last())
  }, options)
  .add('kefir', function (deferred) {
    runKefir(deferred, kefirFromArray(a).flatMapLatest(kefirFromArray).scan(sum, 0).last())
  }, options)
  .add('bacon', function (deferred) {
    runBacon(deferred, bacon.fromArray(a).flatMapLatest(bacon.fromArray).reduce(0, sum))
  }, options)

runSuite(suite)

function sum (x, y) {
  return x + y
}
