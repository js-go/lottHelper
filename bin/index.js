require('dotenv').config()

const { server, runDependency } = require('../src/app')

const PORT = process.env.PORT || 8080

runDependency()
  .then(() => {
    server.listen(PORT, () => {
      console.info(`Server listening on port: ${PORT}`)
    })
  })
  .catch(err => {
    if (err) {
      console.error('服务启动失败')
      console.error(err)
    }
  })
