//Importer bcrypt
const bcrypt = require('bcrypt');

//Importer jsonwebtoken
const jwt = require('jsonwebtoken');

//Importer le modèle User
const User = require('../models/User');

//Importer cryptojs pour chiffrer l'email
const cryptojs = require('crypto-js');

//Importer le plugin email-validator
const emailValidator = require('email-validator');

//Créer un compte utilisateur 
exports.signup = (req, res, next) => {
    //Chiffrer l'email avant de l'envoyer dans base de données (algo HmacSHA256 pour plus de sécurité)
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTO_MAIL).toString();
    //Hacher le password, fonction asynchrone
    if (emailValidator.validate(req.body.email)) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: emailCryptoJs,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch((error) => {
                        res.status(400).json({ error });
                        console.log(error);
                    });
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        res.status(400).json({ error: `Le format de l'adresse email est incorrecte` });
    }
};

//Se connecter à son compte utilisateur
exports.login = (req, res, next) => {
    //chiffrer l'email avant de l'envoyer dans base de données
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTO_MAIL).toString();
    //vérifier si un utilisateur existe dans la base de données et si le mot de passe transmis par le client correspond à l'utilisateur
    //utiliser la méthode findOne de la classe User et passer un objet qui va servir de filtre (sélecteur)
    User.findOne({ email: emailCryptoJs })
        //gérer la promesse retournée par findOne
        //vérifier si l'utilisateur a été trouvé
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: `L'identifiant et/ou le mot de passe sont incorrects` });
            } else {
                //comparer le mot de passe de la base de données et celui qui a été transmis
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: `L'identifiant et/ou le mot de passe sont incorrects` });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                //envoyer une chaîne de caractères encodée grâce à la fonction webtoken
                                token: jwt.sign( //ici, les données encodées(payload) à l'intérieur du token avec 3 arguments
                                    { userId: user._id }, //créer un objet userId qui sera l'identifiant utilisateur du user pour s'assurer que la requête correspond à ce userId
                                    process.env.SECRET_TOKEN, //créer la clé secrète pour sécuriser l'encodage
                                    { expiresIn: process.env.TOKEN_LIFETIME } //appliquer une expiration pour le token
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};
