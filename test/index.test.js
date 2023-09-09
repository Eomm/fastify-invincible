'use strict'

const plugin = require('../index')
const t = require('tap')

// TODO: this module needs tests
t.test('fastify-invincible', async (t) => {
  t.plan(1)
  t.ok(plugin, 'fastify-invincible loads OK')
})
