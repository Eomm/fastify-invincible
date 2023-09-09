'use strict'

const fp = require('fastify-plugin')
const { request } = require('undici')

async function fastifyInvincible (fastify, options) {
  const createCheckPayload = {
    name: 'My Check',
    slug: 'my-check',
    tags: 'fastify plugin',
    desc: 'My check description',
    timeout: 3600, // Minimum: 60 (one minute), maximum: 31536000 (365 days).
    grace: 3600, // Minimum: 60 (one minute), maximum: 31536000 (365 days).
    // schedule: '', // If you specify both timeout and schedule parameters, Healthchecks.io will create a Cron check and ignore the timeout value.
    tz: 'UTC', // Timezone for the schedule. See the list of supported timezones.
    manual_resume: false,
    methods: '',
    channels: '', // integration
    unique: ['name', 'slug']

  }

  await undiciPost(createCheckPayload, options.key)
}

const plugin = fp(fastifyInvincible, {
  name: 'fastify-invincible',
  fastify: '^4.x'
})

module.exports = plugin
module.exports.default = plugin
module.exports.fastifyInvincible = plugin

async function undiciPost (payload, key) {
  const { statusCode, headers, body } = await request('https://healthchecks.io/api/v3/checks/', {
    method: 'POST',
    body: JSON.stringify(payload),
    throwOnError: true,
    headers: {
      'content-type': 'application/json',
      'X-Api-Key': key
    }
  })

  console.log('response received', statusCode)
  console.log('headers', headers)
  console.log('data', await body.json())
}
