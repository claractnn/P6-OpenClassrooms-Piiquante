//Importer mongoose
const mongoose = require('mongoose');

//Importer dotenv
const dotenv = require('dotenv');
dotenv.config();

//Connecter la base de données MongoDB et gérer l'erreur
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}${process.env.DB_URL}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Exporter mongoose
module.exports = mongoose;

