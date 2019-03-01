// Composition plan to consume a redis stream

const redis = require('redis')
const { init: initRedisClient, subscribe } = require('./redis')
const { runEffects, map, tap } = require("@most/core")
const { createAdapter } = require("@most/adapter")
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

// Create an adapter to "push" events from redis.
const [ onMessage, messageStream ] = createAdapter()

// Create the operations on a simple most.js stream that:
// - parses a JSON message and extracts the `value` property,
// - logs the value as a side effect,
const fromMessage
  = map(message => JSON.parse(message).value)
const logValue
  = tap(value => log('received value =', value))

// Compose the stream from the operations.
const receiveNewValues
  = fromMessage(logValue(messageStream))

// Run the stream.
runEffects(receiveNewValues, newDefaultScheduler())

// Start the app.
client
  .then(subscribe(channel, onMessage))
  .then(() => log(`Consumer listening on ${channel}.`))
  .catch(crash)
