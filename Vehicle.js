const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// Define Vehicle model
const Vehicle = sequelize.define('Vehicle', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  RegistrationNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Make: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Colour: {
    type: DataTypes.STRING,
    allowNull: false
  },
  VehicleType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Features: {
    type: DataTypes.STRING,
    allowNull: true
  },
  LastServiceDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Rented: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Vehicles', // Set table name to 'Vehicles'
  timestamps: false // Disable timestamps (createdAt, updatedAt)
});

module.exports = Vehicle; // Export Vehicle model
