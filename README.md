# Vehicle Rental Management Application

## Description
The Vehicle Rental Management Application is a web-based system designed to facilitate the rental and management of vehicles. It allows users to browse available vehicles, rent them, manage rentals, and perform administrative tasks such as adding new vehicle types and managing vehicle colors.

## Table of Contents
- [Project Structure](#project-structure)
- [Application Installation and Usage Instructions](#application-installation-and-usage-instructions)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Environment Variables (.env)](#environment-variables-env)
- [Additional Libraries/Packages](#additional-librariespackages)
- [NodeJS Version Used](#nodejs-version-used)
- [Database](#database)
- [Database Access](#database-access)
- [API Endpoints](#api-endpoints)
- [Licenses](#licenses)
- [Notes](#notes)

### Project Structure

```bash
├── bin
│   └── www
├── middleware
│   └── auth.js
├── models
│   ├── Rental.js
│   ├── User.js
│   ├── Vehicle.js
│   ├── VehicleColor.js
│   ├── VehicleType.js
│   └── index.js
├── public
│   ├── img
│   │   └── CarRental.jpg
│   ├── js
│   │   └── common.js
│   ├── json
│   │   ├── users.json
│   │   └── vehicles.json
│   ├── stylesheets
│   │   ├── base.css
│   │   ├── index.css
│   │   ├── login.css
│   │   └── styles.css
│   └── favicon.ico
├── routes
│   ├── colours.js
│   ├── index.js
│   ├── types.js
│   └── vehicles.js
├── services
│   ├── populate.js
│   └── syncDatabase.js
├── views
│   ├── partials
│   │   └── navbar.ejs
│   ├── colours.ejs
│   ├── error.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── types.ejs
│   └── vehicles.ejs
├── .env
├── README.md
├── app.js
├── captain-definition
├── package-lock.json
├── package.json
└── sequelize.js
```

## Application Installation and Usage Instructions

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd vehicle-rental-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To run the application locally:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## Environment Variables (.env)

```
DB_NAME=rentaldb
DB_USER=dabcaowner
DB_PASSWORD=dabca1234
DB_HOST=localhost
DB_DIALECT=mysql
PORT=3000
```

## Additional Libraries/Packages

- Express.js
- Sequelize
- MySQL2
- Passport.js
- Bootstrap
- dotenv
- Express-Session

## NodeJS Version Used

Node.js version: v20.14.0

## Database

The application uses MySQL database to store vehicle and user data.

## Database Access

To create the database owner "dabcaowner" with full permissions:

```sql
CREATE DATABASE rentaldb;

USE rentaldb;

CREATE LOGIN dabcaowner WITH PASSWORD = 'dabca1234';
ALTER SERVER ROLE sysadmin ADD MEMBER dabcaowner;
```

To create and populate the database tables run the following commands in the terminal one by one:

```bash
node .\services\syncDatabase.js

node .\services\populate.js
```

Fetch and filter data from the database:

```sql
-- Popular Vehicle Types
SELECT VehicleType, COUNT(VehicleType) AS count
FROM Vehicles
GROUP BY VehicleType
ORDER BY count DESC
LIMIT 10;

-- Currently Rented Vehicles
SELECT v.Id, v.RegistrationNo, v.Make, v.Model, v.Colour, v.VehicleType, v.Features, v.LastServiceDate, v.Rented,
       u.fullName AS RentedBy
FROM Vehicles v
JOIN Rentals r ON v.Id = r.vehicleId
JOIN Users u ON r.userId = u.id
WHERE r.returnDate IS NULL;

-- Vehicles Requiring Service (handled in backend with Sequelize)

-- Cruise Control
SELECT *
FROM Vehicles
WHERE Features LIKE '%Cruise Control%';

-- All Vehicles
SELECT *
FROM Vehicles;
```

## API Endpoints

- **POST `/signup`**: Create a new user account.
- **POST `/login`**: Authenticate and log in a user.
- **POST `/logout`**: Log out the current user.
- **GET `/vehicles`**: Retrieve all vehicles.
- **POST `/vehicles/:id/rent`**: Rent a vehicle.
- **PUT `/vehicles/:id/cancel-rental`**: Cancel a vehicle rental.
- **GET `/colours`**: Retrieve all vehicle colors (admin-only).
- **POST `/colours/add`**: Add a new vehicle color (admin-only).
- **POST `/colours/update`**: Update a vehicle color (admin-only).
- **POST `/colours/:id/delete`**: Delete a vehicle color (admin-only).

### Notes:
- Replace `<repository_url>` with the actual URL of your project's GitHub repository.
- Customize the database URL, session secret, and other environment variables according to your setup.
- Feel free to reach out if you have any questions or need assistance with the project. Whether it's setting up regular meetings for code explanations, discussing future enhancements, or any other project-related inquiries, I'm here to help!

You can contact me directly via email at [amukoahdavid@gmail.com](mailto:amukoahdavid@gmail.com).

## Licenses
"CarRental.jpg" source: "https://www.vecteezy.com".