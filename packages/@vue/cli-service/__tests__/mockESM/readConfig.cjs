const Service = require('../../lib/Service')

const service = new Service(__dirname, {
  plugins: [],
  useBuiltIn: false
})
service.init()

process.stdout.write(JSON.stringify(service.projectOptions.lintOnSave))
