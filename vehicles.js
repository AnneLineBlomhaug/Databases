const express = require('express');
const router = express.Router();
const { Vehicle, Rental, sequelize } = require('../models');
const { isAdmin, isAuthenticated } = require('../middleware/auth');

// Helper function to determine if a vehicle needs service
const needsService = (lastServiceDate) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return new Date(lastServiceDate) < sixMonthsAgo;
};

// GET all vehicles (all users)
router.get('/', async (req, res, next) => {
  try {
    const vehicles = await Vehicle.findAll();
    const vehiclesWithServiceStatus = vehicles.map(vehicle => ({
      ...vehicle.toJSON(),
      Serviceable: needsService(vehicle.LastServiceDate)
    }));
    res.render('vehicles', { user: req.user, vehicles: vehiclesWithServiceStatus });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).send('Error fetching vehicles.');
  }
});

// POST create a new vehicle (admin only)
router.post('/', isAdmin, async (req, res, next) => {
  try {
    const { RegistrationNo, Make, Model, Colour, VehicleType, Features, LastServiceDate } = req.body;
    const newVehicle = await Vehicle.create({
      RegistrationNo,
      Make,
      Model,
      Colour,
      VehicleType,
      Features,
      LastServiceDate
    });
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).send('Error creating vehicle.');
  }
});

// PUT update a vehicle (admin only)
router.put('/:id', isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { RegistrationNo, Make, Model, Colour, VehicleType, Features, LastServiceDate } = req.body;
    const updatedVehicle = await Vehicle.update({
      RegistrationNo,
      Make,
      Model,
      Colour,
      VehicleType,
      Features,
      LastServiceDate
    }, {
      where: { id },
      returning: true
    });
    res.json(updatedVehicle[1][0]);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).send('Error updating vehicle.');
  }
});

// DELETE delete a vehicle (admin only)
router.delete('/:id', isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Vehicle.destroy({ where: { id } });
    res.sendStatus(204); // No content
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).send('Error deleting vehicle.');
  }
});

// Rent a vehicle (customer only)
router.post('/:id/rent', isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is already renting a vehicle
    const existingRental = await Rental.findOne({ where: { userId, returnDate: null } });
    if (existingRental) {
      return res.status(400).send('You can only rent one vehicle at a time.');
    }

    // Check if vehicle is already rented
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).send('Vehicle not found.');
    }
    if (vehicle.Rented) {
      return res.status(400).send('Vehicle is already rented.');
    }
    
    // Check if vehicle needs service
    if (needsService(vehicle.LastServiceDate)) {
      return res.status(400).send('Vehicle needs service and cannot be rented.');
    }

    // Rent the vehicle
    await Rental.create({ userId, vehicleId: id, rentalDate: new Date() });
    await vehicle.update({ Rented: true });

    res.sendStatus(200);
  } catch (error) {
    console.error('Error renting vehicle:', error);
    res.status(500).send('Error renting vehicle.');
  }
});

router.put('/:vehicleId/cancel-rental', isAdmin, async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user.id;

    // Find rental by vehicleId and userId
    const rental = await Rental.findOne({ where: { vehicleId, returnDate: null } });
    if (!rental) {
      return res.status(404).send('Rental not found.');
    }

    // Verify if the user is an admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).send('Only admins can cancel rentals.');
    }

    // Find vehicle associated with the rental
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (vehicle) {
      await vehicle.update({ Rented: false });
    } else {
      console.error(`Vehicle not found for vehicleId: ${vehicleId}`);
      return res.status(404).send('Associated vehicle not found.');
    }

    // Destroy rental record
    await rental.destroy();
    res.sendStatus(200);

  } catch (error) {
    console.error('Error cancelling rental:', error);
    res.status(500).send('Error cancelling rental.');
  }
});

// GET popular vehicle types with details (all users)
router.get('/popular-types', isAuthenticated, async (req, res, next) => {
  try {
    const sqlQuery1 = `
      SELECT VehicleType, Id, RegistrationNo, Make, Model, Colour, Features, LastServiceDate, Rented
      FROM Vehicles
      WHERE VehicleType IN (
        SELECT VehicleType FROM Vehicles
        GROUP BY VehicleType
        HAVING COUNT(*) > 1
      )`;

    const results = await sequelize.query(sqlQuery1, { type: sequelize.QueryTypes.SELECT });
    const vehiclesWithServiceStatus = results.map(vehicle => ({
      ...vehicle,
      Serviceable: needsService(vehicle.LastServiceDate)
    }));

    res.json(vehiclesWithServiceStatus);
  } catch (error) {
    console.error('Error executing popular types query:', error);
    res.status(500).send('Error fetching popular vehicle types.');
  }
});


// GET currently rented vehicles (all users)
router.get('/currently-rented', async (req, res, next) => {
  try {
    const sqlQuery2 = `
      SELECT Vehicles.Id, Vehicles.RegistrationNo, Vehicles.Make, Vehicles.Model, Vehicles.Colour,
             Vehicles.VehicleType, Vehicles.Features, Vehicles.LastServiceDate, Vehicles.Rented, Rentals.rentalDate
      FROM Vehicles
      INNER JOIN Rentals ON Vehicles.id = Rentals.vehicleId
      WHERE Rentals.returnDate IS NULL`;
    const results = await sequelize.query(sqlQuery2, { type: sequelize.QueryTypes.SELECT });
    res.json(results);
  } catch (error) {
    console.error('Error executing currently rented query:', error);
    res.status(500).send('Error fetching currently rented vehicles.');
  }
});

// GET vehicles requiring service (admin only)
router.get('/needs-service', isAdmin, async (req, res, next) => {
  try {
    const sqlQuery3 = `
      SELECT Id, RegistrationNo, Make, Model, Colour, VehicleType, Features, LastServiceDate, Rented
      FROM Vehicles
      WHERE LastServiceDate < DATE_SUB(NOW(), INTERVAL 6 MONTH)`;
    const results = await sequelize.query(sqlQuery3, { type: sequelize.QueryTypes.SELECT });
    const vehiclesWithServiceStatus = results.map(vehicle => ({
      ...vehicle,
      Serviceable: needsService(vehicle.LastServiceDate)
    }));
    res.json(vehiclesWithServiceStatus);
  } catch (error) {
    console.error('Error executing needs service query:', error);
    res.status(500).send('Error fetching vehicles requiring service.');
  }
});

// GET vehicles with cruise control (all users)
router.get('/cruise-control', async (req, res, next) => {
  try {
    const sqlQuery4 = `
      SELECT Id, RegistrationNo, Make, Model, Colour, VehicleType, Features, LastServiceDate, Rented
      FROM Vehicles
      WHERE Features LIKE '%Cruise control%'`;
    const results = await sequelize.query(sqlQuery4, { type: sequelize.QueryTypes.SELECT });
    res.json(results);
  } catch (error) {
    console.error('Error executing cruise control query:', error);
    res.status(500).send('Error fetching vehicles with cruise control.');
  }
});

// GET all vehicles (all users)
router.get('/all', async (req, res, next) => {
  try {
    const sqlQuery5 = `SELECT * FROM Vehicles`;
    const results = await sequelize.query(sqlQuery5, { type: sequelize.QueryTypes.SELECT });

    const vehiclesWithServiceStatus = results.map(vehicle => ({
      ...vehicle,
      Serviceable: needsService(vehicle.LastServiceDate)
    }));

    res.json(vehiclesWithServiceStatus);
  } catch (error) {
    console.error('Error executing all vehicles query:', error);
    res.status(500).send('Error fetching all vehicles.');
  }
});

module.exports = router;
