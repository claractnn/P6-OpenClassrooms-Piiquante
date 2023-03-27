const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();

//Ajouter les propriétés du schéma du mot de passe
passwordSchema
    .is().min(6) 
    .is().max(12) 
    .has().uppercase() 
    .has().lowercase() 
    .has().digits() 
    .has().not().spaces() 
    .has().symbols();

//Exporter le module 
module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(400).json({ error: `Le mot de passe doit contenir : entre 6 et 12 caractères et 
        au minimum une lettre en majuscule, une lettre en minuscule, un chiffre et un caractère spécial` })
    };
};

