// Composition plan to publish to a redis stream

const redis = require('redis')
const { init: initRedisClient, publisher } = require('./redis')
const { runEffects, periodic, scan, map, tap } = require("@most/core")
const { newDefaultScheduler } = require("@most/scheduler")
const { config } = require('./config')

// Create a logging abstraction.  Could also be graylog, logstash, etc.
const { log, error, warn } = console
const crash = err => { error(err); process.exit(1) }

// Read config from env vars.
const { host, port, timeout, channel } = config(warn)(process.env)

// Create and initialize a redis client.
const client
  = initRedisClient(redis, { host, port, timeout }, error)
    .catch(crash) // fail hard if we can't connect!

// Create the operations on a simple most.js stream that:
// - creates a new event every 3 seconds,
// - increments ("monotonically increases") a value,
// - stringifies to a JSON object with a `value` property,
// - logs the value as a side effect.
const everyThreeSeconds
  = periodic(3000)
const monotonicallyIncrease
  = scan(b => b + 1)
const toJsonMessage
  = map(value => JSON.stringify({ value }))
const logValue
  = tap(value => log('sending value =', value))

// Compose the stream from the operations.
const emitPeriodicMonotonicNumbers
  = logValue(toJsonMessage(monotonicallyIncrease(0)(everyThreeSeconds)))

// Start the app.
// Note how the `publish` function is composed into the stream as a side effect.`
// This happens in a promise chain because the redis client and, therefore, the
// `publish` function are available asynchronously.
client
  .then(publisher(channel))
  .then(publish => tap(publish, emitPeriodicMonotonicNumbers))
  .then(stream => runEffects(stream, newDefaultScheduler()))
  .then(() => log(`Publisher publishing on ${channel}.`))
  .catch(crash)
