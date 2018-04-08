const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
  var AccessToken = sequelize.define('AccessToken', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    ttl:  { type: Sequelize.INTEGER, allowNull: false }, // 过期时间
    user_id:  { type: Sequelize.INTEGER, allowNull: false }
  })

  return AccessToken
}
