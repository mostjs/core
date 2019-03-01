// Functions to work with redis clients.

// Create and initialize a redis client using the proided host, port, timeout,
// and onError handler.
const init
  = exports.init
  = ({ createClient }, { port, host, timeout }, onError) => {
    // Create a promise for a redis client
    const clientP
      = new Promise(
        (resolve, reject) => {
          const client = createClient({ port, host })
          client.on('ready', () => resolve(client))
          client.on('error', reject)
        }
      )

    // Create redis timeout detector (() => Promise)
    const redisTimeout
      = rejectAfter(timeout, `Redis failed to respond after ${timeout} msec!`)

    return Promise.race([ clientP, redisTimeout() ])
      .then(client => client.on('error', onError))
  }

// Subscribe a client to a channel by name (string), sending received mesasges
// to the onMessage handler.
const subscribe
  = exports.subscribe
  = (channel, onMessage) => client => {
    client.on('message', (_, message) => onMessage(message))
    client.subscribe(channel)
    return client
  }

// Create a publish function for a redis client that sends messages on a
// sepcific channel by name (string).
const publisher
  = exports.publisher
  = channel => client => {
    return message => client.publish(channel, message)
  }

// Helper: reject after the given msec with an Error having the given message.
const rejectAfter
  = (msec, message) => () =>
    new Promise(
      (_, reject) =>
        setTimeout(() => reject(new Error(message)), msec)
    )
