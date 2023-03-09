//Importer le modèle Sauce
const Sauce = require('../models/Sauce');

//Importer package filesystem de Node
const fs = require('fs');

//Récupérer toutes les sauces 
exports.getAllSauces = (req, res) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.satuts(400).json({ error }));
};

exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id:req.paramas.id })
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }))
}

exports.createSauce = (req, res, next) => {
    //parser l'objet requête car l'objet envoyé dans la requête est sous format json mais en chaîne de caractère
    const sauceObject = JSON.parse(req.body.sauce);
    //Supprimer le champ _id car l'id de l'objet va être généré automatiquement par la base de données
    delete sauceObject._id;
    //Supprimer le champ userId qui correspond à la personne qui a créé l'objet, (never trust user), utiliser le userId qui vient du token d'authentification car c'est sûr qu'il est valide 
    delete sauceObject.userId;
    //Créer le nouveau objet avec les informations transmises par l'utilisateur sans les champs précédents
    const sauce = new Sauce({
        ...sauceObject,
        //Extraire l'userId de l'objet requête grâce au middleware
        userId: req.auth.userId,
        //Générer l'url de l'image (car multer transmet seulemennt le nom du fichier)
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    //Enregistrer l'objet dans la base de données
    sauce.save()
    .then(() => res.status(201).json({ message: 'Votre sauce a bien été enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};