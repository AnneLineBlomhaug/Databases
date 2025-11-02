const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('rentaldb', 'root', 'Mchafuziarts189', {
  host: 'localhost',
  port: 3307,
  dialect: 'mysql'
});

module.exports = sequelize;

// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('rentaldb', 'dabcaowner', 'dabca1234', {
//   host: 'localhost',
//   port: 3306,
//   dialect: 'mysql'
// });

// module.exports = sequelize;
