//Importer mongoose
const mongoose = require('mongoose');

//Connecter la base de données MongoDB et gérer l'erreur
mongoose.connect(`mongodb+srv://piiquante:piiquante_oc@piiquante.zdq5mmz.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Exporter mongoose
module.exports = mongoose;

