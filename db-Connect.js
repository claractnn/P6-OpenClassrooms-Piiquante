//Importer mongoose
const mongoose = require('mongoose');

//Connecter la base de données MongoDB et gérer l'erreur
mongoose.connect(`mongodb+srv://piiquante_2:piiquante2@cluster0.y3olnmn.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Exporter mongoose
module.exports = mongoose;

