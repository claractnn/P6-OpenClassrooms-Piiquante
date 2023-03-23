//Importer le package http natif de Node
const http = require('http');

//Éxécuter l'application Express sur le serveur node
const app = require('./app');

//Renvoyer la valeur du port ou le boléen false
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

//La valeur du port est définie en utilisant la variable d'environnement du port par défaut ou 3000
const port = normalizePort(process.env.PORT || 3000);
//L'application Express est configurée pour écouter sur le port défini
app.set('port', port);

//Messages d'exception/erreur pour gérer les erreurs lors du démarrage serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
        default:
            throw error;
    }
};

//Créer un serveur en passant la fonction app comme argument
//Les requests/responses seront traitées dans app.js
const server = http.createServer(app); 

//Les événements error et listening sont gérés par les fonctions errorHandler
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

//Configurer le serveur pour qu'il écoute la variable d'environnement du port par défaut ou le port 3000
server.listen(port);