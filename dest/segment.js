var Analytics = require('analytics-node')


module.exports = segment


function segment(options) {
  var analytics = null
  
  return {
    init: async function() {
      analytics = new Analytics(options.apikey)
    },
    event: function(msg, res, meta) {
      console.log('SEGMENT EVENT', msg, res)

      var handler = intern.handle[msg.cmd]
      if(meta.error || !handler) {
        handler = intern.handle.error
      }

      handler(this, options, analytics, msg, res, meta)
    }
  }
}

var d = null

const intern = (segment.intern) = {
  handle: {
    register: function(seneca, options, analytics, msg, res, meta) {
      // if res.ok!!!

      analytics.identify({
        userId: res.user.id,
        timestamp: (d=new Date(),d.setTime(meta.start),d),
        traits: {
          test: !!options.test,
          mailof: (res.user.email||'').split('@')[1]
        }
      })

      analytics.track({
        userId: res.user.id,
        event: 'signed-up',
        timestamp: (d=new Date(),d.setTime(meta.start),d),
        properties: {
          test: !!options.test,
          from: 'speaker',
          plan: 'free'
        }
      })
    },

    login: function(seneca, options, analytics, msg, res, meta) {
      var d = null
      analytics.track({
        userId: res.user.id,
        event: 'signed-in',
        timestamp: (d=new Date(),d.setTime(meta.start),d),
        properties: {
          test: !!options.test,
          signin: res.login.id
        }
      })
    },

    error: function(seneca, options, analytics, msg, res, meta) {
      console.log('ERROR HANDLER', msg, res, meta)
    }
  }
}
