var express = require('express');
var router = express.Router();
const { User } = require('../models');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configure Passport.js
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express', user: req.user, message: req.flash('error') });
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Express', user: req.user, message: req.flash('error') });
});

// POST route for signup
router.post('/signup', async (req, res, next) => {
  const { username, firstname, lastname, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      req.flash('error', 'Username already exists.');
      return res.redirect('/signup');
    }

    // Create a new user in the database
    const newUser = await User.create({
      fullName: `${firstname} ${lastname}`,
      username,
      password,
      role: 'customer', // Set default role as customer
    });

    res.redirect('/login'); // Redirect to login page after successful signup
  } catch (error) {
    console.error('Error signing up:', error);
    req.flash('error', 'Error signing up. Please try again later.');
    res.redirect('/signup');
  }
});

// POST route for login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

// POST route for logout
router.post('/logout', (req, res, next) => {
  req.logout(); // This clears the user session
  res.redirect('/'); // Redirect to the home page after logout
});

module.exports = router;
