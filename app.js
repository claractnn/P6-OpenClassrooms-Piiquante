const express = require('express')
//const mongoose = require('mongoose');
//Importation mongoose
const mongoose = require('./db-Connect');

const app = express();
//const path = require ('path'); // Module apportant des méthodes pour retourner des URL

const userRoutes = require('./routes/user-routes');

//dotenv.config();
//dbConnect(); /onnexion à la base de données

//Middleware généraux
app.use(express.json()); // Middleware parsant la requête en objet JS

// Définition des autorisations CORS
app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

//Routes de l'API
app.use('/api/auth', userRoutes);

module.exports = app;


