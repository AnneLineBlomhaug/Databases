const express = require('express');
const router = express.Router();
const { VehicleColor } = require('../models');

// Middleware function to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed to next middleware or route handler
    } else {
        res.status(403).send('Unauthorized'); // User is not authorized
    }
};

// GET all colors (only accessible by admin)
router.get('/', isAdmin, async (req, res, next) => {
    try {
        const colours = await VehicleColor.findAll();
        res.render("colours", { user: req.user, colours: colours });
    } catch (error) {
        console.error("Error fetching vehicle colors:", error);
        res.status(500).send("Internal Server Error");
    }
});

// POST add new color
router.post('/add', async (req, res, next) => {
    try {
        const { colorName } = req.body;
        await VehicleColor.create({ Name: colorName });
        res.redirect('/colours');
    } catch (error) {
        console.error("Error adding vehicle color:", error);
        res.status(500).send("Internal Server Error");
    }
});

// POST update color
router.post('/update', async (req, res, next) => {
    try {
        const { id, colorName } = req.body;
        await VehicleColor.update({ Name: colorName }, { where: { Id: id } });
        res.redirect('/colours');
    } catch (error) {
        console.error("Error updating vehicle color:", error);
        res.status(500).send("Internal Server Error");
    }
});

// POST delete color
router.post('/:id/delete', async (req, res, next) => {
    const { id } = req.params;
    try {
        await VehicleColor.destroy({ where: { Id: id } });
        res.redirect('/colours');
    } catch (error) {
        console.error("Error deleting vehicle color:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
