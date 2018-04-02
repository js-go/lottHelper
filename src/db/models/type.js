module.exports = function (sequelize, DataTypes) {
  var Type = sequelize.define('Type', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
    name:  { type: Sequelize.STRING, allowNull: false },
    species:  { type: Sequelize.STRING, allowNull: false }
  })

  return Type
}
