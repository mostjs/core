// Functions to handle app configuration.

const config
  = exports.config
  = report => env => {
    const port = 'REDIS_PORT' in env ? Number(env.REDIS_PORT) : 6379
    const host = 'REDIS_HOST' in env ? env.REDIS_HOST : '127.0.0.1'
    const timeout = 'TIMEOUT' in env ? Number(env.TIMEOUT) : 2500
    const channel
      = 'REDIS_CHANNEL' in env ? env.REDIS_CHANNEL : 'most-redis-docker-example'

    // The other env vars will cause obvious errors if missing, but
    // `REDIS_CHANNEL` will cause silent failures if the user forgets to set it.
    if (!('REDIS_CHANNEL' in env))
      report(`Warning: REDIS_CHANNEL env var is missing. Using ${channel}.`)

    return { port, host, timeout, channel }
  }
