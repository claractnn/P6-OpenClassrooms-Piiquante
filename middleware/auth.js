//Importer le jsonwebtoken
const jwt = require('jsonwebtoken');

//Exporter la fonction qui sera le middleware
module.exports = (req, res, next) => {
    //Récupérer le token, (mot clé bearer et token) et enlever la première partie
    try {
        //Récupérer le header et diviser la chaîne de caractères en un tableau autour de l'espace qui se trouve entre le mot-clé bearer et le token 
        const token = req.headers.authorization.split(' ')[1];
        //Décoder le token en faisant appel à la méthode verify de jwt en lui passant le token qu'on a récupéré et la clé secrète
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //Récupérer le userId dans le token : décoder et récupérer sa propriété userId
        const userId = decodedToken.userId;
        //Rajouter cette valeur à l'objet request qui lui est transmis aux routes qui vont être appelées ensuite
        //Crée l'objet auth dans req avec le champ userId
        req.auth = {
            userId: userId
        };
    next();
    } catch(error) {
        res.status(401).json({ error });
    }
};