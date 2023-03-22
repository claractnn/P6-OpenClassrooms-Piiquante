const express = require('express');
const router = express.Router();

//Configurer le router avec le contrôleur et le middleware pour associer les fonctions à la route
const userCtrl = require('../controllers/user-ctrl');
const password = require('../middleware/password-validator')

//Créer deux routes POST (car le frontend va envoyer des informations (mail + password))
router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

//Exporter le routeur 
module.exports = router;


