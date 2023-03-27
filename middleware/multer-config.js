const multer = require('multer');

//Générer les extensions des fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//Configurer le chemin et le nom des fichiers entrants vers l'API
const storage = multer.diskStorage({ 
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const nameFile = file.originalname.split(".")[0];
        const allName = nameFile.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, allName + '_' + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');

