//Importer multer
const multer = require('multer');

//Créer un objet qui servira de dictionnaire
const MIME_TYPES = {
    '/images/jpg': 'jpg',
    '/images/jpeg': 'jpeg',
    '/images/png': 'png'
}

//Crée un objet de configuration pour multer
const storage = multer.diskStorage({ //Utiliser fonction diskStorage pour l'enregistrer sur le disque
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)
    }
});

module.exports = multer({ storage }), single('image');