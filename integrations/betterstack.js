'use strict'
const { request } = require('undici')

module.exports = function (betterstackOptions) {
  return {
    createMonitor: createMonitor.bind(null, betterstackOptions)
  }
}

async function createMonitor (betterstackOptions, name, url, seconds) {
  const {
    key,
    uniqueUrl = true,
    createMonitorPayload
  } = betterstackOptions

  if (uniqueUrl) {
    // I must check if the monitor already exists
    const existingMonitor = await checkExistingMonitors(betterstackOptions, name)
    if (existingMonitor) {
      existingMonitor.isCreated = false
      return existingMonitor
    }
  }

  // https://betterstack.com/docs/uptime/api/create-a-new-monitor/
  const reqPayload = {
    monitor_type: 'status',
    pronounceable_name: name,
    http_method: 'GET',
    request_timeout: 60,
    email: true,
    sms: false,
    call: false,
    push: false,
    paused: false,
    follow_redirects: false,
    remember_cookies: false,
    regions: ['us', 'eu', 'as', 'au'],
    ...createMonitorPayload,
    url,
    check_frequency: seconds
  }

  const { body } = await request('https://uptime.betterstack.com/api/v2/monitors',
    {
      method: 'POST',
      body: JSON.stringify(reqPayload),
      throwOnError: true,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${key}`
      }
    })

  const { data } = await body.json()
  return data
}

async function checkExistingMonitors (betterstackOptions, name) {
  const { key } = betterstackOptions

  const remoteUrl = new URL('https://uptime.betterstack.com/api/v2/monitors')
  remoteUrl.search = new URLSearchParams({
    pronounceable_name: name,
    per_page: 250
  })

  const { body } = await request(remoteUrl.toString(),
    {
      method: 'GET',
      throwOnError: true,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${key}`
      }
    })

  const { data: monitors } = await body.json()

  if (monitors.length > 0) {
    return monitors[0]
  }

  return null
}
