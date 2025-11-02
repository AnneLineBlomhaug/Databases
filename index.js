const sequelize = require('../sequelize');
const User = require('./User');
const Vehicle = require('./Vehicle');
const VehicleType = require('./VehicleType');
const VehicleColor = require('./VehicleColor');
const Rental = require('./Rental');

// Define relationships
User.hasMany(Rental, { foreignKey: 'userId' }); // User has many rentals
Rental.belongsTo(User, { foreignKey: 'userId' }); // Rental belongs to a user

Vehicle.hasMany(Rental, { foreignKey: 'vehicleId' }); // Vehicle has many rentals
Rental.belongsTo(Vehicle, { foreignKey: 'vehicleId' }); // Rental belongs to a vehicle

module.exports = { sequelize, User, Vehicle, VehicleType, VehicleColor, Rental };
