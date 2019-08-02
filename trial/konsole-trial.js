const Seneca = require('seneca')

var si = Seneca({ legacy: { transport: false } })
    //.test()
    .use('promisify')
    .use('entity')
    .use('basic')
    .use('user')
    .use('..', {
      dest:[
        {name:'noop'},
        {name:'konsole'}
      ]
    })
    .ready(async function() {
      await this.post('role:user,cmd:register,name:Joe\x20Bloggs,email:joe.bloggs@example.com')
      await this.post('role:user,cmd:login,email:joe.bloggs@example.com,auto:true')
    })

