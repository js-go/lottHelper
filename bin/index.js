const app = require('../src/app')

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})

module.exports = server
