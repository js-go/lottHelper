const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
  var Lottery = sequelize.define('Lottery', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    periods: { type: Sequelize.INTEGER, allowNull: false }, // 彩票期数
    is_signle: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }, //1：单式  2：复式
    numbers: { type: Sequelize.STRING, allowNull: false }, // 号码
    name: { type: Sequelize.STRING, allowNull: false }, // 彩票名称
    user_id: { type: Sequelize.STRING, allowNull: false },
    species: { type: Sequelize.STRING, allowNull: false }, //1：福彩  2：体彩,
    cid: { type: Sequelize.STRING }, // 彩票ID DLT='大乐透' SSQ='双色球'
    winning: { type: Sequelize.STRING,  defaultValue: 0  }, // 1为一等奖 ....0为不中奖
    check: { type: Sequelize.BOOLEAN,  defaultValue: false } // 校验用户上传的中奖结果
  })

  return Lottery
}
