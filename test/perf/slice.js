require('buba/register')
const Benchmark = require('benchmark');
const {fromArray, skip, take} = require('../../src/index');
const {reduce} = require('../../src/combinator/accumulate')
const rx = require('rx');
const rxjs = require('@reactivex/rxjs')
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

const suite = Benchmark.Suite('skip(n/4) -> take(n/2) ' + n + ' integers');
const options = {
  defer: true,
  onError: function(e) {
    e.currentTarget.failure = e.error;
  }
};

const s = n * 0.25;
const t = n * 0.5;

suite
  .add('most', function(deferred) {
    runners.runMost(deferred, reduce(sum, 0, take(t, skip(s, fromArray(a)))));
  }, options)
  .add('rx 4', function(deferred) {
    runners.runRx(deferred, rx.Observable.fromArray(a).skip(s).take(t).reduce(sum, 0));
  }, options)
  .add('rx 5', function(deferred) {
    runners.runRx5(deferred,
      rxjs.Observable.from(a).skip(s).take(t).reduce(sum, 0));
  }, options)
  .add('xstream', function(deferred) {
    runners.runXstream(deferred, xs.fromArray(a).drop(s).take(t).fold(sum, 0).last());
  }, options)
  .add('kefir', function(deferred) {
    runners.runKefir(deferred, kefirFromArray(a).skip(s).take(t).scan(sum, 0).last());
  }, options)
  .add('bacon', function(deferred) {
    runners.runBacon(deferred, bacon.fromArray(a).skip(s).take(t).reduce(0, sum));
  }, options)
  .add('highland', function(deferred) {
    runners.runHighland(deferred, highland(a).drop(s).take(t).reduce(0, sum));
  }, options)

runners.runSuite(suite);

function add1(x) {
  return x + 1;
}

function even(x) {
  return x % 2 === 0;
}

function sum(x, y) {
  return x + y;
}
