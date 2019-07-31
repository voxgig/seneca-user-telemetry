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
  var si = await seneca_instance().ready()
  expect(si).exist()
})

function seneca_instance(config, plugin_options) {
  return Seneca(config, { legacy: { transport: false } })
    .test()
    .use('promisify')
    .use('entity')
    .use(Plugin, plugin_options)
}
