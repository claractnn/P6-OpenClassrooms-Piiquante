const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://piiquante_2:piiquante2@cluster0.y3olnmn.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = mongoose;

