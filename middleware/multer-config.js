//Importer multer
const multer = require('multer');

//Créer un objet qui servira de dictionnaire
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

//Crée un objet de configuration pour multer
const storage = multer.diskStorage({ //Utiliser fonction diskStorage pour l'enregistrer sur le disque
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        //Récupérer le nom original en séparant l'extension
        const nameFile = file.originalname.split(".")[0];
        //Ajouter un underscore si un espace est trouvé dans le nom du fichier
        const allName = nameFile.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        //Définir le nom global du fichier avec un timestamp pour qu'il soit unique et l'extension.
        callback(null, allName + '_' + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage}).single('image');
console.log(storage);
