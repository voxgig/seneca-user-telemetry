/* Copyright (c) 2019 voxgig and other contributors, MIT License */
'use strict'

module.exports = user_telemetry
module.exports.defaults = {
  dest: []
}
module.exports.errors = {}

// NEXT: load referenced entity

function user_telemetry(options) {
  var dests = null

  var stats = {
    _start: Date.now(),
    _instance: this.id,
    register: 0,
    login: 0
  }
  stats._last = stats._start

  this.message('sys:user-telemetry,get:stats', get_stats)
    .sub('out$:true,sys:user,cmd:register', handle_event)
    .sub('out$:true,sys:user,cmd:login', handle_event)

  this.prepare(async function() {
    dests = await intern.resolve_dest(this, options)

    for (var i = 0; i < dests.length; i++) {
      if (dests[i].init) {
        this.log.info({ case: 'init', dest: dests[i].name })

        try {
          await dests[i].init.call(this, dests[i].options$)
        } catch (err) {
          this.log.error({ what: 'init', dest: dests[i].name, err: err })
        }
      }
    }
  })

  async function get_stats(msg) {
    return this.util.deep(stats)
  }

  function handle_event(msg, res, meta) {
    var cmd = msg.cmd

    if (null != stats[cmd]) {
      stats[cmd]++
      stats._last = Date.now()
    }

    for (var i = 0; i < dests.length; i++) {
      // NOTE: called synchronously!
      try {
        dests[i].event.call(this, msg, res, meta)
      } catch (err) {
        this.log.error({
          what: 'event',
          dest: dests[i].name,
          err: err,
          msg: msg,
          res: res,
          meta: meta
        })
      }
    }
  }
}

const intern = (user_telemetry.intern = {
  resolve_dest: async function(seneca, options) {
    var dests = []
    var folder = __dirname + '/dest'
    for (var i = 0; i < options.dest.length; i++) {
      var dest_opts = options.dest[i]

      if (
        null != dest_opts.name &&
        (null == dest_opts.active || false !== dest_opts.active)
      ) {
        var dest_definer = require(folder + '/' + dest_opts.name)

        var dest = dest_definer.call(seneca, dest_opts)
        dest.name$ = dest_opts.name
        dest.options$ = dest_opts

        seneca.log.info({ case: 'load', dest: dest.name })

        dests.push(dest)
      }
    }
    return dests
  }
})
