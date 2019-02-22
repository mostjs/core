// Functions to handle app configuration.

const config
  = exports.config
  = env => {
    const port = Number(env.REDIS_PORT || 6379)
    const host = String(env.REDIS_HOST || '127.0.0.1')
    const timeout = Number(env.TIMEOUT || 2500)
    const channel = env.REDIS_CHANNEL

    if (!channel) throw new Error(`REDIS_CHANNEL not specified.`)

    return { port, host, timeout, channel }
  }
