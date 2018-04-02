const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const options = {
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

const client = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  options
)

const models = {}

const modalPath = path.join(__dirname, '/models').toString()

// read all models and import them into the "db" object
fs
  .readdirSync(modalPath)
  .filter(function (file) {
    return file.indexOf('.') !== 0 && file !== 'index.js'
  })
  .forEach(function (file) {
    const model = client.import(path.join(__dirname, '/models', file))
    models[model.name] = model
  })

Object.keys(models).forEach(function (modelName) {
  if (models[modelName].options.hasOwnProperty('associate')) {
    models[modelName].options.associate(models)
  }
})

module.exports = models
module.exports.client = client
