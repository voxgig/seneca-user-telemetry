
module.exports = test


function test(options) {
  var log = options.log()
  return {
    init: async function() {
      return new Promise((resolve)=>{
        setTimeout(()=>{
          log.push('init')
          resolve()
        },100)
      })
    },
    event: function(msg) {
      log.push('event/'+msg.cmd)
    }
  }
}
