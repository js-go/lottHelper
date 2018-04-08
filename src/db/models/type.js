const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
  var Type = sequelize.define('Type', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
    name:  { type: Sequelize.STRING, allowNull: false }, // 彩票名称
    species:  { type: Sequelize.STRING, allowNull: false } //1：福彩  2：体彩
  })

  return Type
}
