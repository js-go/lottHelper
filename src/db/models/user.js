const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    openid:  { type: Sequelize.STRING, allowNull: false },
    name:  { type: Sequelize.STRING, allowNull: false },
    phone:  { type: Sequelize.STRING, allowNull: false },
    address: { type: Sequelize.STRING }
  })

  return User
}
