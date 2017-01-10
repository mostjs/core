require('buba/register')
const Benchmark = require('benchmark');
const {fromArray, scan, reduce} = require('../../src/index');
const rx = require('rx');
const rxjs = require('@reactivex/rxjs');
const kefir = require('kefir');
const bacon = require('baconjs');
const highland = require('highland');
const xs = require('xstream').default;

const runners = require('./runners');
const kefirFromArray = runners.kefirFromArray;

// Create a stream from an Array of n integers
// filter out odds, map remaining evens by adding 1, then reduce by summing
const n = runners.getIntArg(1000000);
const a = new Array(n);
for(let i = 0; i< a.length; ++i) {
  a[i] = i;
}

const suite = Benchmark.Suite('scan -> reduce ' + n + ' integers');
const options = {
  defer: true,
  onError: function(e) {
    e.currentTarget.failure = e.error;
  }
};

suite
  .add('most', function(deferred) {
    runners.runMost(deferred, reduce(passthrough, 0, scan(sum, 0, fromArray(a))));
  }, options)
  .add('rx 4', function(deferred) {
    runners.runRx(deferred, rx.Observable.fromArray(a).scan(sum, 0).reduce(passthrough, 0));
  }, options)
  .add('rx 5', function(deferred) {
    runners.runRx5(deferred, rxjs.Observable.from(a).scan(sum, 0).reduce(passthrough, 0));
  }, options)
  .add('xstream', function(deferred) {
    runners.runXstream(deferred, xs.fromArray(a).fold(sum, 0).fold(passthrough, 0).last());
  }, options)
  .add('kefir', function(deferred) {
    runners.runKefir(deferred, kefirFromArray(a).scan(sum, 0).scan(passthrough, 0).last());
  }, options)
  .add('bacon', function(deferred) {
    runners.runBacon(deferred, bacon.fromArray(a).scan(0, sum).reduce(0, passthrough));
  }, options)
  .add('highland', function(deferred) {
    runners.runHighland(deferred, highland(a).scan(0, sum).reduce(0, passthrough));
  }, options);

runners.runSuite(suite);

function sum(x, y) {
  return x + y;
}

function passthrough(z, x) {
  return x;
}
