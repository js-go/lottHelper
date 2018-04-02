module.exports = function (sequelize, DataTypes) {
  var Lottery = sequelize.define('Lottery', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    periods: { type: Sequelize.INTEGER, allowNull: false },
    is_signle: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    numbers: {type: Sequelize.STRING, allowNull: false },
    name: {type: Sequelize.STRING, allowNull: false },
    user_id: {type: Sequelize.STRING, allowNull: false },
    species: {type: Sequelize.STRING, allowNull: false }
  })

  return Lottery
}
