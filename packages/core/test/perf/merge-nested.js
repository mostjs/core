require('babel-register')
const Benchmark = require('benchmark')
const { merge } = require('../../src/index')
const { reduce } = require('../helper/reduce')
const rx = require('rxjs')
const rxo = require('rxjs/operators')
const kefir = require('kefir')
const bacon = require('baconjs')
const highland = require('highland')
const xs = require('xstream').default

const { getIntArg, runSuite, kefirFromArray, mostFromArray, runMost, runRx6, runXstream, runKefir, runBacon, runHighland } = require('./runners')

xs.prototype.merge = function (s) { return xs.merge(this, s) }

// Merging n streams, each containing m items.
// Results in a single stream that merges in n x m items
// In Array parlance: Take an Array containing n Arrays, each of length m,
// and flatten it to an Array of length n x m.
const n = getIntArg(10000)
const a = buildArray(n)

function buildArray (n) {
  const a = new Array(n)
  for (let i = 0; i < a.length; ++i) {
    a[i] = i
  }
  return a
}

function mergeRx (n) {
  let s = rx.from(a)
  for (let i = 0; i < n; ++i) {
    s = s.pipe(rxo.merge(rx.from(a)))
  }
  return s
}

function mergeMost (n) {
  let s = mostFromArray(a)
  for (let i = 0; i < n; ++i) {
    s = merge(mostFromArray(a), s)
  }
  return s
}

function mergeXstream (n) {
  let s = xs.fromArray(a)
  for (let i = 0; i < n; ++i) {
    s = xs.merge(xs.fromArray(a), s)
  }
  return s
}

function mergeKefir (n) {
  let s = kefirFromArray(a)
  for (let i = 0; i < n; ++i) {
    s = s.merge(kefirFromArray(a))
  }
  return s
}

function mergeBacon (n) {
  let s = bacon.fromArray(a)
  for (let i = 0; i < n; ++i) {
    s = s.merge(bacon.fromArray(a))
  }
  return s
}

function mergeHighland (n) {
  // HELP WANTED: Is there a better way to do this in highland?
  // The two approaches below perform similarly
  let s = highland(a)
  for (let i = 0; i < n; ++i) {
    s = highland([s, highland(a)]).merge()
  }
  return s
}

const suite = Benchmark.Suite('merge nested streams w/depth 2, 5, 10, 100 (' + n + ' items in each stream)')
const options = {
  defer: true,
  onError: function (e) {
    e.currentTarget.failure = e.error
  }
}

suite
  .add('most (depth 2)', function (deferred) {
    const s = mergeMost(2)
    runMost(deferred, reduce(sum, 0, s))
  }, options)
  .add('most (depth 5)', function (deferred) {
    const s = mergeMost(5)
    runMost(deferred, reduce(sum, 0, s))
  }, options)
  .add('most (depth 10)', function (deferred) {
    const s = mergeMost(10)
    runMost(deferred, reduce(sum, 0, s))
  }, options)
  .add('most (depth 100)', function (deferred) {
    const s = mergeMost(100)
    runMost(deferred, reduce(sum, 0, s))
  }, options)
  // .add('most (depth 1000)', function deferred) {
  //   const s = mergeMost(1000)
  //   runMost(deferred, reduce(sum, 0, s))
  // }, options)
  // .add('most (depth 10000)', function (deferred) {
  //   const s = mergeMost(10000)
  //   runMost(deferred, reduce(sum, 0, s))
  // }, options)
  .add('rx 6 (depth 2)', function (deferred) {
    const s = mergeRx(2)
    runRx6(deferred, s.pipe(rxo.reduce(sum, 0)))
  }, options)
  .add('rx 6 (depth 5)', function (deferred) {
    const s = mergeRx(5)
    runRx6(deferred, s.pipe(rxo.reduce(sum, 0)))
  }, options)
  .add('rx 6 (depth 10)', function (deferred) {
    const s = mergeRx(10)
    runRx6(deferred, s.pipe(rxo.reduce(sum, 0)))
  }, options)
  .add('rx 6 (depth 100)', function (deferred) {
    const s = mergeRx(100)
    runRx6(deferred, s.pipe(rxo.reduce(sum, 0)))
  }, options)
  .add('xstream (depth 2)', function (deferred) {
    const s = mergeXstream(2)
    runXstream(deferred, s.fold(sum, 0).last())
  }, options)
  .add('xstream (depth 5)', function (deferred) {
    const s = mergeXstream(5)
    runXstream(deferred, s.fold(sum, 0).last())
  }, options)
  .add('xstream (depth 10)', function (deferred) {
    const s = mergeXstream(10)
    runXstream(deferred, s.fold(sum, 0).last())
  }, options)
  .add('xstream (depth 100)', function (deferred) {
    const s = mergeXstream(100)
    runXstream(deferred, s.fold(sum, 0).last())
  }, options)
  .add('kefir (depth 2)', function (deferred) {
    const s = mergeKefir(2)
    runKefir(deferred, s.scan(sum, 0).last())
  }, options)
  .add('kefir (depth 5)', function (deferred) {
    const s = mergeKefir(5)
    runKefir(deferred, s.scan(sum, 0).last())
  }, options)
  .add('kefir (depth 10)', function (deferred) {
    const s = mergeKefir(10)
    runKefir(deferred, s.scan(sum, 0).last())
  }, options)
  .add('kefir (depth 100)', function (deferred) {
    const s = mergeKefir(100)
    runKefir(deferred, s.scan(sum, 0).last())
  }, options)
  .add('bacon (depth 2)', function (deferred) {
    const s = mergeBacon(2)
    runBacon(deferred, s.reduce(0, sum))
  }, options)
  .add('bacon (depth 5)', function (deferred) {
    const s = mergeBacon(5)
    runBacon(deferred, s.reduce(0, sum))
  }, options)
  .add('bacon (depth 10)', function (deferred) {
    const s = mergeBacon(10)
    runBacon(deferred, s.reduce(0, sum))
  }, options)
  .add('bacon (depth 100)', function (deferred) {
    const s = mergeBacon(100)
    runBacon(deferred, s.reduce(0, sum))
  }, options)
  .add('highland (depth 2)', function (deferred) {
    const s = mergeHighland(2)
    runHighland(deferred, s.reduce(0, sum))
  }, options)
  .add('highland (depth 5)', function (deferred) {
    const s = mergeHighland(2)
    runHighland(deferred, s.reduce(0, sum))
  }, options)
  .add('highland (depth 10)', function (deferred) {
    const s = mergeHighland(10)
    runHighland(deferred, s.reduce(0, sum))
  }, options)
  // WARNING: Never finishes at 10k items
  // .add('highland (depth 100)', function(deferred) {
  //   const s = mergeHighland(100)
  //   runHighland(deferred, s.reduce(0, sum))
  // }, options)

runSuite(suite)

function sum(x, y) {
  return x + y
}
