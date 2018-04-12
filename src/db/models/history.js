const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
  var History = sequelize.define('History', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    species: { type: Sequelize.STRING, allowNull: false }, //1：福彩  2：体彩,
    cid: { type: Sequelize.STRING }, // 彩票ID DLT='大乐透' SSQ='双色球'
    url: { type: Sequelize.STRING, allowNull: true }, // 又拍云url
    user_id:  { type: Sequelize.INTEGER, allowNull: false }
  })

  return History
}
