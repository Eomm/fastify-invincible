# fastify-invincible

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![ci](https://github.com/Eomm/fastify-invincible/actions/workflows/ci.yml/badge.svg)](https://github.com/Eomm/fastify-invincible/actions/workflows/ci.yml)

An hacky plugin to integrate [betterstack.com](https://betterstack.com/) and keep your Fastify application up and running.

## Install

```
npm install fastify-invincible
```

### Compatibility

| Plugin version | Fastify version |
| ------------- |:---------------:|
| `^0.1.0` | `^4.0.0` |


## Usage

This plugin is a raw integration with [betterstack.com](https://betterstack.com/).
It will create a new monitor for your application during the startup phase.

If a monitor with the same `name` already exists, it will be skipped.

Note that this plugin is an early stage POC, so it may change in the future.

```js
const fastifyInvincible = require('fastify-invincible')
const app = require('fastify')({ logger: true })

app.head('/foo-bar', (req, reply) => {
  reply.send('ok')
})

const appUrl = 'https://example.com'
app.register(fastifyInvincible, {
  name: 'My app',
  pollingUrl: appUrl + '/foo-bar',
  pollingIntervalSeconds: 300,
  betterstackOptions: {
    key: 'your-api-key',
    uniqueUrl: true, // if you set it to false, the plugin will add a new monitor at every restart
    createMonitorPayload: {
      // customize all the payload fields as you want adding the ones you need:
      // https://betterstack.com/docs/uptime/api/create-a-new-monitor/
      http_method: 'HEAD',
    }
  }
})

app.listen({ port: 8080 })
```


## License

Copyright [Manuel Spigolon](https://github.com/Eomm), Licensed under [MIT](./LICENSE).
