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

// Create stream
const everyThreeSeconds
  = periodic(3000)
const monotonicallyIncrease
  = scan(b => b + 1)
const toJsonMessage
  = map(value => JSON.stringify({ value }))
const logValue
  = tap(value => log('sending value =', value))

const emitPeriodicMonotonicNumbers
  = logValue(toJsonMessage(monotonicallyIncrease(0)(everyThreeSeconds)))

client
  .then(publisher(channel))
  .then(publish => tap(publish, emitPeriodicMonotonicNumbers))
  .then(stream => runEffects(stream, newDefaultScheduler()))
  .then(() => log(`Publisher publishing on ${channel}.`))
  .catch(crash)
