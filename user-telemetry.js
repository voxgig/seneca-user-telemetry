/* Copyright (c) 2019 voxgig and other contributors, MIT License */
'use strict'


// const Docs = require('./user-telemetry-docs.js')

module.exports = user_telemetry
module.exports.defaults = {
  dest: []
}
module.exports.errors = {}

// NEXT: load referenced entity

function user_telemetry(options) {
  var dests = null

  this
    .sub('role:user,cmd:register', handle_event)
    .sub('role:user,cmd:login', handle_event)

  this.prepare(async function() {
    dests = await intern.resolve_dest(this, options)

    for(var i = 0; i < dests.length; i++) {
      if(dests[i].init) {
        this.log.info({case:'init',dest:dests[i].name})
        await dests[i].init.call(this,dests[i].options$)
      }
    }
  })


  function handle_event(msg, meta) {
    for(var i = 0; i < dests.length; i++) {
      // NOTE: called synchronously!
      dests[i].event.call(this, msg, meta)
    }
  }
}

const intern = (user_telemetry.intern = {
  resolve_dest: async function(seneca, options) {
    var dests = []
    var folder = __dirname+'/dest'
    for(var i = 0; i < options.dest.length; i++ ) {
      var dest_opts = options.dest[i]

      if(null != dest_opts.name &&
         (null == dest_opts.active || false !== dest_opts.active) ) {

        var dest_definer = require(folder+'/'+dest_opts.name)

        var dest = dest_definer.call(seneca, dest_opts)
        dest.name$ = dest_opts.name
        dest.options$ = dest_opts

        seneca.log.info({case:'load',dest:dest.name})

        dests.push(dest)
      }
    }
    return dests
  }
})
