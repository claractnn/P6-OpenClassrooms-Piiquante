//Importer dotenv pour les variables d'environnement
require('dotenv').config();
//Placer l'application express
const express = require('express')
//Importation mongoose
const mongoose = require('./db-Connect');

//Importer les plugins pour renforcer la sécurité
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

//Créer l'application Express
const app = express();
const path = require('path'); // Module apportant des méthodes pour retourner des URL

const userRoutes = require('./routes/user-routes');
const sauceRoutes = require('./routes/sauce-routes');


//Middleware généraux
app.use(express.json()); // Middleware parsant la requête en objet JS
app.use(mongoSanitize()); //Middleware contre les injections requête
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //Middleware contre les vulnérabilités liées aux en-têtes

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


