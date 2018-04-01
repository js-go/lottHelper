require('dotenv').config()

const { server, runDep } = require('../src/app')

const PORT = process.env.PORT || 8080

runDep()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`)
    })
  })
  .catch(err => {
    if (err) {
      console.error('服务启动失败')
      console.error(err)
    }
  })

module.exports = server
