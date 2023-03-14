//Importer password-validator
const passwordValidator = require('password-validator');

//Créer le schéma de validation du mot de passe
const passwordSchema = new passwordValidator();

//Ajouter les propriétés 
passwordSchema
.is().min(6) //minimum de 6 caractères
.is().max(12) //maximum de 12 caractères
.has().uppercase() //minimum 1 lettre en majuscule
.has().lowercase() //contient des lettres en minuscule
.hast().digits() //minimum 1 chiffre
.has().not().spaces() //aucun espace accepté
.has().symbols(); //un symbole

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(400).json({ error: `Le mot de passe doit contenir : entre 6 et 12 caractères et au minimum une lettre en majuscule, une lettre en minuscule, un chiffre et un caractère spécial`})
    }
};