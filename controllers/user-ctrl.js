const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cryptojs = require('crypto-js');
const emailValidator = require('email-validator');

//Créer un compte utilisateur 
exports.signup = (req, res, next) => {
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTO_MAIL).toString();
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
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTO_MAIL).toString();
    User.findOne({ email: emailCryptoJs })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: `L'identifiant et/ou le mot de passe sont incorrects` });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: `L'identifiant et/ou le mot de passe sont incorrects` });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign( 
                                    { userId: user._id },  
                                    process.env.SECRET_TOKEN, 
                                    { expiresIn: process.env.TOKEN_LIFETIME } 
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};
