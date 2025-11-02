const express = require('express');
const router = express.Router();
const { VehicleType } = require('../models');

// Middleware function to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
      next(); // User is admin, proceed to next middleware or route handler
  } else {
      res.status(403).send('Unauthorized'); // User is not authorized
  }
};

// GET all types (only accessible by admin)
router.get('/', isAdmin, async (req, res, next) => {
  try {
    const types = await VehicleType.findAll();
    res.render('types', { user: req.user, types: types });
  } catch (error) {
    console.error('Error fetching vehicle types:', error);
    res.status(500).send('Error fetching vehicle types.');
  }
});

// POST add new type
router.post('/add', async (req, res, next) => {
  try {
    const { typeName } = req.body;
    await VehicleType.create({ Name: typeName });
    res.redirect('/types');
  } catch (error) {
    console.error('Error adding vehicle type:', error);
    res.status(500).send('Error adding vehicle type.');
  }
});

// POST update type
router.post('/update', async (req, res, next) => {
  try {
    const { id, typeName } = req.body;
    await VehicleType.update({ Name: typeName }, { where: { Id: id } });
    res.redirect('/types');
  } catch (error) {
    console.error('Error updating vehicle type:', error);
    res.status(500).send('Error updating vehicle type.');
  }
});

// POST delete type
router.post('/:id/delete', async (req, res, next) => {
  const { id } = req.params;
  try {
    await VehicleType.destroy({ where: { Id: id } });
    res.redirect('/types');
  } catch (error) {
    console.error('Error deleting vehicle type:', error);
    res.status(500).send('Error deleting vehicle type.');
  }
});

module.exports = router;
