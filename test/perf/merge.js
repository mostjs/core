require('buba/register')
const Benchmark = require('benchmark');
const {from, mergeArray, reduce, map} = require('../../src/index');
const rx = require('rx');
const rxjs = require('@reactivex/rxjs')
const kefir = require('kefir');
const bacon = require('baconjs');
const highland = require('highland');
const xs = require('xstream').default;

const runners = require('./runners');
const kefirFromArray = runners.kefirFromArray;

// Merging n streams, each containing m items.
// Results in a single stream that merges in n x m items
// In Array parlance: Take an Array containing n Arrays, each of length m,
// and flatten it to an Array of length n x m.
const mn = runners.getIntArg2(100000, 10);
const a = build(mn[0], mn[1]);

function build(m, n) {
  const a = new Array(n);
  for(let i = 0; i< a.length; ++i) {
    a[i] = buildArray(i*1000, m);
  }
  return a;
}

function buildArray(base, n) {
  const a = new Array(n);
  for(let i = 0; i< a.length; ++i) {
    a[i] = base + i;
  }
  return a;
}

const suite = Benchmark.Suite('merge ' + mn[0] + ' x ' + mn[1] + ' streams');
const options = {
  defer: true,
  onError: function(e) {
    e.currentTarget.failure = e.error;
  }
};

suite
  .add('most', function(deferred) {
    const streams = map(from, a);
    runners.runMost(deferred, reduce(sum, 0, mergeArray(streams)));
  }, options)
  .add('rx 4', function(deferred) {
    const streams = a.map(rx.Observable.fromArray);
    runners.runRx(deferred, rx.Observable.merge.apply(void 0, streams).reduce(sum, 0));
  }, options)
  .add('rx 5', function(deferred) {
    const streams = a.map(function(x) {return rxjs.Observable.from(x)});
    runners.runRx5(deferred,
      rxjs.Observable.merge.apply(rxjs.Observable, streams).reduce(sum, 0))
  }, options)
  .add('xstream', function(deferred) {
    const streams = a.map(xs.fromArray);
    runners.runXstream(deferred, xs.merge.apply(xs, streams).fold(sum, 0).last())
  }, options)
  .add('kefir', function(deferred) {
    const streams = a.map(kefirFromArray);
    runners.runKefir(deferred, kefir.merge(streams).scan(sum, 0).last());
  }, options)
  .add('bacon', function(deferred) {
    const streams = a.map(bacon.fromArray);
    runners.runBacon(deferred, bacon.mergeAll(streams).reduce(0, sum));
  }, options)
  // .add('highland', function(deferred) {
  // Commented out because it never finishes on Node >= 6.9.1 on my machine
  //   // HELP WANTED: Is there a better way to do this in highland?
  //   // The two approaches below perform similarly
  //   const streams = a.map(highland);
  //   runners.runHighland(deferred, highland(streams).merge().reduce(0, sum));
  //   //runners.runHighland(deferred, highland(streams).flatMap(identity).reduce(0, sum));
  // }, options);

runners.runSuite(suite);

function sum(x, y) {
  return x + y;
}
