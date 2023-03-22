const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');

//Configurer le routeur avec le contrôleur pour associer les fonctions aux routes
const sauceCtrl = require('../controllers/sauce-ctrl');

//Créer toutes les routes selon les fonctions du contrôleur
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

//Exporter le routeur 
module.exports = router;

