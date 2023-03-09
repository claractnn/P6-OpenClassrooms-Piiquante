//Importer bcrypt
const bcrypt = require('bcrypt');

//Importer jsonwebtoken
const jwt = require('jsonwebtoken');

//Importer le modèle User
const User = require('../models/User');

//Créer un compte utilisateur (middleware d'authentification)
exports.signup = (req, res) => {
    //hacher le password, fonction asynchrone
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch((error) => {
                    res.status(400).json({ error });
                    console.log(error);
                })
        })
        .catch(error => res.status(500).json({ error }));
};

//Se connecter à son compte utilisateur
exports.login = (req, res, next) => {
    //Vérifier si un utilisateur existe dans la base de données et si le mdp transmis par le client correspond à l'utilisateur
    //Utiliser la méthode findOne de la classe User et passer un objet qui va servir de filtre (sélecteur)
    User.findOne({ email: req.body.email })
        //Gérer la promesse retournée par findOne
        //Vérifier si l'utilisateur a été trouvé
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: `L'identifiant et/ou le mot de passe sont incorrects` });
            } else {
                //comparer le mdp de la base de données et celui qui a été transmis
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: `L'identifiant et/ou le mot de passe sont incorrects` });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                //Envoyer une chaîne de caractères encodée grâce à la fonction webtoken
                                token: jwt.sign( //ici, les données encodées(payload) à l'intérieur du token avec 3 arguments
                                    { userId: user._id }, //créer un objet userId qui sera l'identifiant utilisateur du user pour s'assurer que la requête correspond à ce userId
                                    'RANDOM_TOKEN_SECRET', //créer la clé secrète pour sécuriser l'encodage
                                    { expiresIn: '24h' } //appliquer une expiration pour le token
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};
