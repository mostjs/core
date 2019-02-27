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

// Create a most.js stream
const fromMessage
  = map(message => JSON.parse(message).value)
const logValue
  = tap(value => log('received value =', value))

const receiveNewValues
  = fromMessage(logValue(messageStream))

// TODO: transform or something?
runEffects(receiveNewValues, newDefaultScheduler())

client
  .then(subscribe(channel, onMessage))
  .then(() => log(`Consumer listening on ${channel}.`))
  .catch(crash)
