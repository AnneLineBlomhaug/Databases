const fs = require('fs');
const path = require('path');
const { sequelize, User, Vehicle } = require('../models');

const populateData = async () => {
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/json/users.json')));
  const vehicles = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/json/vehicles.json')));

  await sequelize.sync({ force: true });

  await User.bulkCreate(users);

  await Vehicle.bulkCreate(vehicles.map(vehicle => ({
    RegistrationNo: vehicle.registrationNo,
    Make: vehicle.make,
    Model: vehicle.model,
    Colour: vehicle.colour,
    VehicleType: vehicle.vehicleType,
    Features: vehicle.features,
    LastServiceDate: vehicle.lastServiceDate,
    Rented: vehicle.rented
  })));

  console.log('Database populated!');
};

populateData();
