const fs = require('fs');
require('dotenv').config()
console.log(process.env.DATABASE_USERNAME)
module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
  },
  production: {

  }
};