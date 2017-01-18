require('buba/register')
const Benchmark = require('benchmark');
const {fromArray, merge: _merge} = require('../../src/index');
const {reduce} = require('../../src/combinator/reduce')
const rx = require('rx');
const rxjs = require('@reactivex/rxjs')
const kefir = require('kefir');
const bacon = require('baconjs');
const highland = require('highland');
const xs = require('xstream').default;

const runners = require('./runners');
const kefirFromArray = runners.kefirFromArray;
xs.prototype.merge = function (s) { return xs.merge(this, s) }

// Merging n streams, each containing m items.
// Results in a single stream that merges in n x m items
// In Array parlance: Take an Array containing n Arrays, each of length m,
// and flatten it to an Array of length n x m.
const n = runners.getIntArg(10000);
const a = buildArray(n);

function buildArray(n) {
  const a = new Array(n);
  for(let i = 0; i< a.length; ++i) {
    a[i] = i;
  }
  return a;
}

function merge(n, create) {
  let s = create(a);
  for(let i=0; i<n; ++i) {
    s = s.merge(create(a))
  }
  return s;
}

function mergeMost(n, create) {
  let s = create(a);
  for(let i=0; i<n; ++i) {
    s = _merge(create(a), s)
  }
  return s;
}


function mergeHighland(n) {
  // HELP WANTED: Is there a better way to do this in highland?
  // The two approaches below perform similarly
  let s = highland(a);
  for(let i=0; i<n; ++i) {
    s = highland([s, highland(a)]).merge();
  }
  return s;
}

const suite = Benchmark.Suite('merge nested streams w/depth 2, 5, 10, 100 (' + n + ' items in each stream)');
const options = {
  defer: true,
  onError: function(e) {
    e.currentTarget.failure = e.error;
  }
};

suite
  .add('most (depth 2)', function(deferred) {
    const s = mergeMost(2, fromArray);
    runners.runMost(deferred, reduce(sum, 0, s));
  }, options)
  .add('most (depth 5)', function(deferred) {
    const s = mergeMost(5, fromArray);
    runners.runMost(deferred, reduce(sum, 0, s));
  }, options)
  .add('most (depth 10)', function(deferred) {
    const s = mergeMost(10, fromArray);
    runners.runMost(deferred, reduce(sum, 0, s));
  }, options)
  .add('most (depth 100)', function(deferred) {
    const s = mergeMost(100, fromArray);
    runners.runMost(deferred, reduce(sum, 0, s));
  }, options)
  // .add('most (depth 1000)', function(deferred) {
  //   const s = merge(1000, most.from);
  //   runners.runMost(deferred, s.reduce(sum, 0));
  // }, options)
  // .add('most (depth 10000)', function(deferred) {
  //   const s = merge(10000, most.from);
  //   runners.runMost(deferred, s.reduce(sum, 0));
  // }, options)
  .add('rx 4 (depth 2)', function(deferred) {
    const s = merge(2, rx.Observable.fromArray);
    runners.runRx(deferred, s.reduce(sum, 0));
  }, options)
  .add('rx 4 (depth 5)', function(deferred) {
    const s = merge(5, rx.Observable.fromArray);
    runners.runRx(deferred, s.reduce(sum, 0));
  }, options)
  .add('rx 4 (depth 10)', function(deferred) {
    const s = merge(10, rx.Observable.fromArray);
    runners.runRx(deferred, s.reduce(sum, 0));
  }, options)
  .add('rx 4 (depth 100)', function(deferred) {
    const s = merge(100, rx.Observable.fromArray);
    runners.runRx(deferred, s.reduce(sum, 0));
  }, options)
  .add('rx 5 (depth 2)', function(deferred) {
    const s = merge(2, function(x) {return rxjs.Observable.from(x)});
    runners.runRx5(deferred, s.reduce(sum, 0));
  }, options)
  .add('rx 5 (depth 5)', function(deferred) {
    const s = merge(5, function(x) {return rxjs.Observable.from(x)});
    runners.runRx5(deferred, s.reduce(sum, 0));
  }, options)
  .add('rx 5 (depth 10)', function(deferred) {
    const s = merge(10, function(x) {return rxjs.Observable.from(x)});
    runners.runRx5(deferred, s.reduce(sum, 0));
  }, options)
  .add('rx 5 (depth 100)', function(deferred) {
    const s = merge(100, function(x) {return rxjs.Observable.from(x)});
    runners.runRx5(deferred, s.reduce(sum, 0));
  }, options)
  .add('xstream (depth 2)', function(deferred) {
    const s = merge(2, xs.fromArray);
    runners.runXstream(deferred, s.fold(sum, 0).last());
  }, options)
  .add('xstream (depth 5)', function(deferred) {
    const s = merge(5, xs.fromArray);
    runners.runXstream(deferred, s.fold(sum, 0).last());
  }, options)
  .add('xstream (depth 10)', function(deferred) {
    const s = merge(10, xs.fromArray);
    runners.runXstream(deferred, s.fold(sum, 0).last());
  }, options)
  .add('xstream (depth 100)', function(deferred) {
    const s = merge(100, xs.fromArray);
    runners.runXstream(deferred, s.fold(sum, 0).last());
  }, options)
  .add('kefir (depth 2)', function(deferred) {
    const s = merge(2, kefirFromArray)
    runners.runKefir(deferred, s.scan(sum, 0).last());
  }, options)
  .add('kefir (depth 5)', function(deferred) {
    const s = merge(5, kefirFromArray)
    runners.runKefir(deferred, s.scan(sum, 0).last());
  }, options)
  .add('kefir (depth 10)', function(deferred) {
    const s = merge(10, kefirFromArray)
    runners.runKefir(deferred, s.scan(sum, 0).last());
  }, options)
  .add('kefir (depth 100)', function(deferred) {
    const s = merge(100, kefirFromArray)
    runners.runKefir(deferred, s.scan(sum, 0).last());
  }, options)
  .add('bacon (depth 2)', function(deferred) {
    const s = merge(2, bacon.fromArray);
    runners.runBacon(deferred, s.reduce(0, sum));
  }, options)
  .add('bacon (depth 5)', function(deferred) {
    const s = merge(5, bacon.fromArray);
    runners.runBacon(deferred, s.reduce(0, sum));
  }, options)
  .add('bacon (depth 10)', function(deferred) {
    const s = merge(10, bacon.fromArray);
    runners.runBacon(deferred, s.reduce(0, sum));
  }, options)
  .add('bacon (depth 100)', function(deferred) {
    const s = merge(100, bacon.fromArray);
    runners.runBacon(deferred, s.reduce(0, sum));
  }, options)
  .add('highland (depth 2)', function(deferred) {
    const s = mergeHighland(2)
    runners.runHighland(deferred, s.reduce(0, sum));
  }, options)
  .add('highland (depth 5)', function(deferred) {
    const s = mergeHighland(2)
    runners.runHighland(deferred, s.reduce(0, sum));
  }, options)
  .add('highland (depth 10)', function(deferred) {
    const s = mergeHighland(10)
    runners.runHighland(deferred, s.reduce(0, sum));
  }, options)
  // WARNING: Never finishes at 10k items
  // .add('highland (depth 100)', function(deferred) {
  //   const s = mergeHighland(100)
  //   runners.runHighland(deferred, s.reduce(0, sum));
  // }, options)

runners.runSuite(suite);

function sum(x, y) {
  return x + y;
}
