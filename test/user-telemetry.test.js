/* Copyright (c) 2019 voxgig and other contributors, MIT License */
'use strict'

// const Util = require('util')

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = (exports.lab = Lab.script())
const expect = Code.expect

const PluginValidator = require('seneca-plugin-validator')
const Seneca = require('seneca')
const Plugin = require('..')

lab.test('validate', PluginValidator(Plugin, module))

lab.test('happy', async () => {
  var log = []
  var si = await seneca_instance(null, {
    dest: [
      {
        name: 'test',
        log: () => log
      }
    ]
  }).ready()

  await si.post(
    'sys:user,cmd:register,user:{name:Joe\x20Bloggs,email:joe.bloggs@example.com}'
  )
  await si.post(
    'sys:user,cmd:login,user:{email:joe.bloggs@example.com,auto:true}'
  )

  expect(log).equal(['init', 'event/register', 'event/login'])

  var stats = await si.post('sys:user-telemetry,get:stats')
  expect(stats).contains({ register: 1, login: 1 })
  expect(stats._start).below(stats._last)
})

function seneca_instance(config, plugin_options) {
  return Seneca(config, { legacy: { transport: false } })
    .test()
    .use('promisify')
    .use('entity')
    .use('basic')
    .use('user')
    .use(Plugin, plugin_options)
}
