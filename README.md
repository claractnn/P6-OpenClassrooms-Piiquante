# CONTEXTE DU PROJET

Piiquante se dédie à la création de sauces épicées dont les recettes sont gardées secrètes. Pour tirer parti de son succès et générer davantage de buzz, l'entreprise souhaite créer une application web dans laquelle les utilisateurs peuvent ajouter leurs sauces préférées et liker ou disliker les sauces ajoutées par les autres.

# OBJECTIFS

Construire une API sécurisée avec des contrôleurs, middlewares, modèles et routes. 
Les utilisateurs peuvent créer un compte et se connecter avec certaines conditions comme par exemple les spécifités d'autorisation du mot de passe et de l'adresse mail.
Les utilisateurs doivent pouvoir créer des sauces, les modifier, les supprimer et les liker/disliker.

# COMPÉTENCES ÉVALUÉES

- Mettre en œuvre des opérations CRUD de manière sécurisée
- Implémenter un modèle logique de données conformément à la réglementation
- Stocker des données de manière sécurisée

# EXIGENCES DE SÉCURITÉ

● Le mot de passe de l'utilisateur doit être haché.
● L'authentification doit être renforcée sur toutes les routes sauce requises.
● Les adresses électroniques dans la base de données sont uniques et un
plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler
les erreurs.
● La sécurité de la base de données MongoDB (à partir d'un service tel que
MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la
machine d'un utilisateur.
● Un plugin Mongoose doit assurer la remontée des erreurs issues de la base
de données.
● Les versions les plus récentes des logiciels sont utilisées avec des correctifs
de sécurité actualisés.
● Le contenu du dossier images ne doit pas être téléchargé sur GitHub.

# LANGAGES ET TECNOLOGIES UTILISÉS

- Javascript
- Nodejs 
- Express
- MongoDB 
- Différents modules et plugins : mongoose, bcrypt, crypto-js, dotenv, email-validator, password validator, jsonwebtoken, multer,