const Sauce = require('../models/Sauce');
const fs = require('fs');

//Afficher toutes les sauces 
exports.getAllSauces = (req, res) => {
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
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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

//Modifier une sauce 
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
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

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé !' })
            } else {
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
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let like = sauce.likes;
            let dislike = sauce.dislikes;
            let usersLiked = sauce.usersLiked;
            let usersDisliked = sauce.usersDisliked;
            console.log(req.body);
            const voted = (usersDisliked.find(id => id === req.body.userId)) || (usersLiked.find(id => id === req.body.userId));
            if (req.body.like === 1) {
                if (!voted) {   
                    like += 1;
                    usersLiked.push(req.body.userId);  
                }
            } else if (req.body.like === -1) {
                if (!voted) {   
                    dislike += 1;
                    usersDisliked.push(req.body.userId);  
                }
            } else if (req.body.like === 0) { 
                if (usersDisliked.find(id => id === req.body.userId)) {
                    dislike -= 1;  
                    usersDisliked = usersDisliked.filter(id => id != req.body.userId);  
                } else if (usersLiked.find(id => id === req.body.userId)) {
                    like -= 1;  
                    usersLiked = usersLiked.filter(id => id != req.body.userId); 
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
