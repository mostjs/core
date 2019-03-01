# Most + Redis + Docker

A suite of simple apps to illustrate how to use most to handle redis events.

This suite may be run using [docker](https://www.docker.com) or [node.js
10.x](https://nodejs.org/en/).  If you have docker installed already or would
like to try it, follow the docker instructions.  Otherwise, you will need to be
running redis locally.  Follow the node instructions to install node and redis.

## Install

### Pre-requisites

1. Install [git](https://help.github.com/articles/set-up-git/)
2. Clone this repo:

```sh
git clone git@github.com:mostjs/core.git
cd examples/most-redis-docker
```

### Assumptions

The remainder of this document assumes your working directory is
`most-redis-docker`.  You may have to modify some of the following directions
if you chose another folder name.

This project uses environment variables.  If you are using the windows command
prompt, you may have to change some commands slightly to use env vars. For
example, rather than type
`REDIS_CHANNEL=most-redis-docker-example npm run consume`, you would type
`set REDIS_CHANNEL=most-redis-docker-example&&npm run consume`.

### Option 1: Docker

1.  Install [docker](https://www.docker.com/get-started).  (You will need to
    create a [DockerHub](https://hub.docker.com) account.)
2.  Build the docker image for this project:

```sh
docker build -t most-redis-docker .
```

### Option 2: node.js

1. Install [node 10.x](https://nodejs.org/en/) or the latest LTS version.
2. Install the dependencies for this project:

```sh
npm install
```

3. Install [redis](https://redis.io/topics/quickstart).

If you already have an instance of redis running, you may edit the docker-
compose.yml file in the `most-redis-docker` folder.  Change any values for
`REDIS_HOST` and `REDIS_PORT` according to your redis instance

## Run

When running this example, the publish service periodically sends JSON messages
to redis, and the consume services receive the JSON messages and transform
them.  In your terminal(s), you should expect to see informational logs from
each service as they start up and as they process the JSON messages.

### Option 1: Docker

1.  From the `most-redis-docker` folder, create and run the docker-compose
    network defined in `docker-compose.yml`:

```sh
docker-compose up
```

Use `Ctrl-C` to stop the docker-compose network.

You may also use `docker-compose up -d` and `docker-compose down` to start and
stop the docker-compose network in the background.

### Option 2: node.js

1.  Start redis.  See the [redis docs](https://redis.io/topics/quickstart) for
    troubleshooting and options.

```sh
redis-server
```

2. From the `most-redis-docker` folder:

```sh
REDIS_CHANNEL=most-redis-docker-example node consume
```

3. Open a new terminal or shell, and from the `most-redis-docker` folder type:

```sh
REDIS_CHANNEL=most-redis-docker-example node consume
```

4. Open a third terminal or shell, and from the `most-redis-docker` folder type:

```sh
REDIS_CHANNEL=most-redis-docker-example node publish
```

## Experiment!

### Env vars

Both the `consume` and `publish` services accept env vars.  If you are using
Docker, these may be modified in the `docker-compose.yml` file.  The following
env vars are used:

- `REDIS_CHANNEL`: string, default is `'most-redis-docker-example'`
- `REDIS_PORT`: integer, default is `6379`
- `REDIS_HOST`: string, default is `'127.0.0.1'`
- `TIMEOUT`: integer, default is `2500`

### Try these scenarios

- *Easy*: Change the channel name for one or more of the services.
- *Easy*: Change the timeout to 0 (there are two ways to do this).  What happens?
- *Master*: Handle some messages differently from others.  Hint: try most.js's
  `filter`, `skipWhile`, or `takeWhile` in the `consume` service.
- *Master*: Modify and configure the `publish` service to publish to 2 channels,
  then configure the `consume` services to each listen to one of those channels.
  Hint: accept a comma-separated list of channels via `REDIS_CHANNEL`?
- *Guru*: Send invalid JSON from the `publish` service and use `recoverWith` in
  the `consume` service to handle it.
- *Guru*: Create a _selective forwarding_ service by re-publishing _some_ of the
  messages from the `consume` service.  
