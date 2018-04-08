const Sequelize = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    openid: { type: Sequelize.STRING, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    phone: { type: Sequelize.STRING },
    gender: { type: Sequelize.INTEGER },
    address: { type: Sequelize.STRING },
    city: { type: Sequelize.STRING },
    province: { type: Sequelize.STRING },
    avatar_url: { type: Sequelize.STRING }
  })

  return User
}
