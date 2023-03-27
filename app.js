require('dotenv').config();
const express = require('express')
const mongoose = require('./db-Connect');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const app = express();
const path = require('path'); 

//Importer les routes user et sauce
const userRoutes = require('./routes/user-routes');
const sauceRoutes = require('./routes/sauce-routes');

//Middleware généraux
app.use(express.json()); 
app.use(mongoSanitize()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); 

// Définition des autorisations CORS
app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

//Routes de l'API
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;


