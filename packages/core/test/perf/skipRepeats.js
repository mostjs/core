require('babel-register')
const Benchmark = require('benchmark')
const { skipRepeats } = require('../../src/index')
const { reduce } = require('../helper/reduce')
const rx = require('rxjs')
const rxo = require('rxjs/operators')
const bacon = require('baconjs')
const xs = require('xstream').default

const { getIntArg, runSuite, kefirFromArray, mostFromArray, runMost, runRx6, runXstream, runKefir, runBacon } = require('./runners')

const xstreamDropRepeats = require('xstream/extra/dropRepeats').default

// Create a stream from an Array of n integers
// filter out odds, map remaining evens by adding 1, then reduce by summing
const n = getIntArg(1000000)
const a = new Array(n)
for (let i = 0, j = 0; i < a.length; i += 2, ++j) {
  a[i] = a[i + 1] = j
}

const suite = Benchmark.Suite('skipRepeats -> reduce 2 x ' + n + ' integers')
const options = {
  defer: true,
  onError: function (e) {
    e.currentTarget.failure = e.error
  }
}

suite
  .add('most', function (deferred) {
    runMost(deferred, reduce(sum, 0, skipRepeats(mostFromArray(a))))
  }, options)
  .add('rx 6', function (deferred) {
    runRx6(deferred, rx.from(a).pipe(rxo.distinctUntilChanged()).pipe(rxo.reduce(sum, 0)))
  }, options)
  .add('xstream', function (deferred) {
    runXstream(deferred, xs.fromArray(a).compose(xstreamDropRepeats()).fold(sum, 0).last())
  }, options)
  .add('kefir', function (deferred) {
    runKefir(deferred, kefirFromArray(a).skipDuplicates().scan(sum, 0).last())
  }, options)
  .add('bacon', function (deferred) {
    runBacon(deferred, bacon.fromArray(a).skipDuplicates().reduce(0, sum))
  }, options)

runSuite(suite)

function sum (x, y) {
  return x + y
}
