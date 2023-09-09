'use strict'

const fp = require('fastify-plugin')
const { request } = require('undici')

async function fastifyInvincible (fastify, options) {
  // https://api.uptimerobot.com/v2/getMonitors?api_key=YOUR_API_KEY_HERE
  const createMonitorPayload = {
    api_key: options.key,
    friendly_name: 'My code',
    url: 'https://example.com',
    type: 1, // HTTP(s)
    interval: 300, // seconds
    timeout: 30, // seconds, max 60
    http_method: 'HEAD'
  }

  await undiciPost(createMonitorPayload, options.key)
}

const plugin = fp(fastifyInvincible, {
  name: 'fastify-invincible',
  fastify: '^4.x'
})

module.exports = plugin
module.exports.default = plugin
module.exports.fastifyInvincible = plugin

async function undiciPost (payload, key) {
  const { statusCode, headers, body } = await request('https://api.uptimerobot.com/v2/newMonitor', {
    method: 'POST',
    body: JSON.stringify(payload),
    throwOnError: true,
    headers: {
      'content-type': 'application/json'
      // 'X-Api-Key': key
    }
  })

  // FREE plan : 10 req/min
  // Retry-After header
  //   'x-ratelimit-remaining': '9',
  // https://api.uptimerobot.com/v2/methodName?format=json

  console.log('response received', statusCode)
  console.log('headers', headers)
  console.log('data', await body.json())

  // {
  //   stat: 'fail',
  //   error: {
  //     type: 'missing_parameter',
  //     parameter_name: 'api_key',
  //     message: 'api_key parameter is missing.'
  //   }
  // }
}
