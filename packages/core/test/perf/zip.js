const Benchmark = require('benchmark');
const {zip} = require('../../src');
const {reduce} = require('../helper/reduce')
const rx = require('rx');
const rxjs = require('@reactivex/rxjs');
const kefir = require('kefir');
const bacon = require('baconjs');
const highland = require('highland');

const runners = require('./runners');
const kefirFromArray = runners.kefirFromArray;
const mostFromArray = runners.mostFromArray
// Create 2 streams, each with n items, zip them by summing the
// corresponding index pairs, then reduce the resulting stream by summing
const n = runners.getIntArg(100000);
const a = new Array(n);
const b = new Array(n);

for(let i = 0; i<n; ++i) {
  a[i] = i;
  b[i] = i;
}

const suite = Benchmark.Suite('zip 2 x ' + n + ' integers');
const options = {
  defer: true,
  onError: function(e) {
    e.currentTarget.failure = e.error;
  }
};

suite
  .add('most', function(deferred) {
    runners.runMost(deferred, reduce(add, 0, zip(add, mostFromArray(b), mostFromArray(a))));
  }, options)
  .add('rx 4', function(deferred) {
    runners.runRx(deferred, rx.Observable.fromArray(a).zip(rx.Observable.fromArray(b), add).reduce(add, 0));
  }, options)
  .add('rx 5', function(deferred) {
    runners.runRx5(deferred, rxjs.Observable.from(a).zip(rxjs.Observable.from(b), add).reduce(add, 0));
  }, options)
  .add('kefir', function(deferred) {
    runners.runKefir(deferred, kefirFromArray(a).zip(kefirFromArray(b), add).scan(add, 0).last());
  }, options)
  .add('bacon', function(deferred) {
    runners.runBacon(deferred, bacon.zipWith(add, bacon.fromArray(a), bacon.fromArray(b)).reduce(0, add));
  }, options)
  .add('highland', function(deferred) {
    runners.runHighland(deferred, highland(a).zip(highland(b)).map(addPair).reduce(0, add));
  }, options)
  // There is no zip in xstream

runners.runSuite(suite);

function addPair(pair) {
  return pair[0] + pair[1];
}
function add(a, b) {
  return a + b;
}
