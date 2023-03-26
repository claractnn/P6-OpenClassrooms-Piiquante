//Importer le modèle Sauce
const Sauce = require('../models/Sauce');

//Importer package filesystem de Node
const fs = require('fs');

//Afficher toutes les sauces 
exports.getAllSauces = (req, res) => {
    //Récupérer le tableau de toutes les sauces retournées pas la base de données
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.satuts(400).json({ error }));
};

//Afficher une seule sauce
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
};

//Créer une sauce
exports.createSauce = (req, res, next) => {
    //Parser l'objet requête car l'objet envoyé dans la requête est sous format json mais en chaîne de caractères
    const sauceObject = JSON.parse(req.body.sauce);
    //Supprimer le champ _id car l'id de l'objet va être généré automatiquement par la base de données
    delete sauceObject._id;
    //Supprimer le champ userId qui correspond à la personne qui a créé l'objet, utiliser le userId qui vient du token d'authentification 
    delete sauceObject.userId;
    //Créer le nouvel objet avec les informations transmises par l'utilisateur sans les champs précédents
    const sauce = new Sauce({
        ...sauceObject,
        //Extraire l'userId de l'objet requête grâce au middleware
        userId: req.auth.userId,
        //Générer l'url de l'image (car multer transmet seulemennt le nom du fichier)
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        //Initialiser les différents paramètres de la sauce ajoutée à 0
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    //Enregistrer l'objet dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Votre sauce a bien été enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

//Modifier une sauce (2 façons, selon si la requête est faite avec un fichier ou non)
exports.modifySauce = (req, res, next) => {
    //Extraire l'objet et regarder s'il y a un champ file
    const sauceObject = req.file ? {
        //Parser ce que l'on récupère
        ...JSON.parse(req.body.sauce),
        //Créer la nouvelle URL de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        //S'il n'y a pas de fichier de transmis, récupérer l'objet directement dans le corps de la requête
    } : { ...req.body };
    //Supprimer le userId de la requête (mesure de sécurité)
    delete sauceObject._userId;
    //Chercher dans la base de données et récupérer la sauce 
    Sauce.findOne({ _id: req.params.id })
        //Vérifier si l'objet correspond bien à l'utilisateur 
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé !' })
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch(error => res.status(400).json({ error }));
            };
        })
        .catch(error => res.status(400).json({ error }))
};

exports.deleteSauce = (req, res, next) => {
    //Récupérer l'objet en base
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //Vérifier les droits (si l'utilisateur correspond)
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé !' })
            } else {
                //Si c'est le bon utilisateur, supprimer l'objet de la base de données et supprimer l'image du système de fichier
                //Récupérer l'URL qui est enregistrée et recréer le chemin sur le fs à partir de celle-ci
                const filename = sauce.imageUrl.split('/images/')[1];
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => {
                        fs.unlink(`images/${filename}`, () => {
                            res.status(200).json({ message: `L'image a bien été supprimée !` })
                        });
                    })
                    .catch(error => res.status(401).json({ error }));
            };
        })
        .catch(error => res.status(500).json({ error }))
};

//Donner son vote sur une sauce
exports.likeSauce = (req, res) => {
    //Récupérer l'objet en base 
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //Définir chaque élement de l'objet sauce
            let like = sauce.likes;
            let dislike = sauce.dislikes;
            let usersLiked = sauce.usersLiked;
            let usersDisliked = sauce.usersDisliked;
            console.log(req.body);
            //Créer une variable qui cherche dans le tableau usersDisliked ou usersLiked si une réaction existe déjà avec l'utilisateur connecté (userId)
            const voted = (usersDisliked.find(id => id === req.body.userId)) || (usersLiked.find(id => id === req.body.userId));
            //Si la requête renvoie un like (1), ajouter 1 aux likes de l'objet sauce
            if (req.body.like === 1) {
                if (!voted) {   //Si l'utilisateur n'est pas trouvé (voted == false)
                    like += 1;
                    usersLiked.push(req.body.userId);  //Ajouter l'userId au tableau des usersLiked
                }
            //Si la requête renvoie un dislike (-1), ajouter 1 aux dislikes de l'objet sauce
            } else if (req.body.like === -1) {
                if (!voted) {   //Si l'utilisateur n'est pas trouvé (voted == false)
                    dislike += 1;
                    usersDisliked.push(req.body.userId);  //Ajouter l'userId au tableau des usersDisliked
                }
            //Si la requête renvoie un 0 (si l'utilisateur retire son vote)
            } else if (req.body.like === 0) { 
                //Vérifier si l'utilisateur a déjà voté (si son id se retrouve dans le tableau usersDisliked))
                if (usersDisliked.find(id => id === req.body.userId)) {
                    dislike -= 1;  //Si l'élément est trouvé, supprimer (enlever 1) aux dislikes
                    usersDisliked = usersDisliked.filter(id => id != req.body.userId);  //Mettre à jour le tableau des dislikes des utilisateurs
                //Vérifier si l'utilisateur a déjà voté (si son id se retrouve dans le tableau usersliked))
                } else if (usersLiked.find(id => id === req.body.userId)) {
                    like -= 1;  //Si l'élément est trouvé, supprimer (enlever 1) aux likes
                    usersLiked = usersLiked.filter(id => id != req.body.userId);  //Mettre à jour le tableau des likes des utilisateurs
                };
            };

            //Mettre à jour l'objet dans la base de données
            Sauce.updateOne({ _id: req.params.id },
                {
                    likes: like,
                    dislikes: dislike,
                    usersLiked: usersLiked,
                    usersDisliked: usersDisliked
                })
                .then(() => res.status(200).json({ message: 'Avis accepté' }))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
