require('buba/register')
const Benchmark = require('benchmark');
const {fromArray, skipRepeats} = require('.././index');
const {reduce} = require('.././combinator/reduce')
const rx = require('rx');
const rxjs = require('@reactivex/rxjs');
const kefir = require('kefir');
const bacon = require('baconjs');
const highland = require('highland');
const xs = require('xstream').default;

const runners = require('./runners');
const kefirFromArray = runners.kefirFromArray;
const xstreamDropRepeats = require('xstream/extra/dropRepeats').default;

// Create a stream from an Array of n integers
// filter out odds, map remaining evens by adding 1, then reduce by summing
const n = runners.getIntArg(1000000);
const a = new Array(n);
for(let i = 0, j = 0; i< a.length; i+=2, ++j) {
  a[i] = a[i+1] = j;
}

const suite = Benchmark.Suite('skipRepeats -> reduce 2 x ' + n + ' integers');
const options = {
  defer: true,
  onError: function(e) {
    e.currentTarget.failure = e.error;
  }
};

suite
  .add('most', function(deferred) {
    runners.runMost(deferred, reduce(sum, 0, skipRepeats(fromArray(a))));
  }, options)
  .add('rx 4', function(deferred) {
    runners.runRx(deferred, rx.Observable.fromArray(a).distinctUntilChanged().reduce(sum, 0));
  }, options)
  .add('rx 5', function(deferred) {
    runners.runRx5(deferred, rxjs.Observable.from(a).distinctUntilChanged().reduce(sum, 0));
  }, options)
  .add('xstream', function(deferred) {
    runners.runXstream(deferred, xs.fromArray(a).compose(xstreamDropRepeats()).fold(sum, 0).last());
  }, options)
  .add('kefir', function(deferred) {
    runners.runKefir(deferred, kefirFromArray(a).skipDuplicates().scan(sum, 0).last());
  }, options)
  .add('bacon', function(deferred) {
    runners.runBacon(deferred, bacon.fromArray(a).skipDuplicates().reduce(0, sum));
  }, options)

runners.runSuite(suite);

function sum(x, y) {
  return x + y;
}
