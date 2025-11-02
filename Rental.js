const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// Define Rental model
const Rental = sequelize.define('Rental', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rentalDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  returnDate: {
    type: DataTypes.DATE,
  },
});

module.exports = Rental; // Export Rental model
