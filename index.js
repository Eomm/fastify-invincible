'use strict'

const fp = require('fastify-plugin')

const supportedIntegrations = {
  betterstack: require('./integrations/betterstack')
}

async function fastifyInvincible (fastify, options) {
  const {
    name = 'fastify-invincible',
    pollingUrl,
    pollingIntervalSeconds,
    integration = 'betterstack'
  } = options

  const buildIntegrator = supportedIntegrations[integration]

  const instance = buildIntegrator(options[`${integration}Options`])
  const result = await instance.createMonitor(name, pollingUrl, pollingIntervalSeconds)

  if (result.isCreated === false) {
    fastify.log.info(`Monitor already exists at ${result.id}`)
  } else {
    fastify.log.info(`Monitor created at ${result.id}`)
  }
}

const plugin = fp(fastifyInvincible, {
  name: 'fastify-invincible',
  fastify: '^4.x'
})

module.exports = plugin
module.exports.default = plugin
module.exports.fastifyInvincible = plugin
