# justify-api

- La longueur des lignes du texte justifié est de 80 caractères.

- L’endpoint doit être de la forme /api/justify et doit retourner un texte justifié suite à une requête POST avec un body de ContentType text/plain.

- L’api utilise un mécanisme d’authentification via token unique. En utilisant une endpoint api/token qui retourne un token d’une requête POST avec un json body {"email": "foo@bar.com"}.

- Il y a un rate limit par token pour l’endpoint /api/justify, fixé à 80 000 mots par jour, si il y en a plus dans la journée il renvoie une erreur 402 Payment Required.