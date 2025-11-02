const { sequelize, VehicleType, VehicleColor } = require('../models');

// Sync all defined models to the DB
sequelize.sync({ force: true }) // This will drop the table if it already exists and recreate it
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(error => {
    console.error('Error creating database & tables:', error);
  });
