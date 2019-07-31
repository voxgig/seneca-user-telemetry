
module.exports = konsole


function konsole(options) {
  return {
    init: async function() {
      return new Promise((resolve)=>{
        setTimeout(()=>{
          console.log('KONSOLE INIT')
          resolve()
        },100)
      })
    },
    event: function() {
      console.log('KONSOLE EVENT', arguments)
    }
  }
}
