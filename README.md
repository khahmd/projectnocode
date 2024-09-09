# Shopify Automation Tools

Ce repository contient plusieurs scripts permettant d'automatiser différentes tâches en lien avec la gestion d'une boutique Shopify et l'utilisation d'APIs externes. Chaque fichier est conçu pour accomplir une tâche spécifique, que ce soit l'import/export de données, le nettoyage des produits ou la gestion des doublons.

## Fichiers inclus

1. **Exporter les données d'une API vers Excel**  
   Script qui permet de récupérer des données à partir d'une API externe et de les exporter dans un fichier Excel. Idéal pour sauvegarder et analyser les données hors ligne.

2. **Envoyer les données d'un fichier Excel vers une boutique Shopify**  
   Ce fichier envoie des produits ou des informations contenues dans un fichier Excel directement vers une boutique Shopify via l'API Shopify. Parfait pour les mises à jour en masse ou les importations initiales.

3. **Envoyer des produits depuis une API directement vers Shopify**  
   Ce script permet d'envoyer les produits d'une API externe vers une boutique Shopify sans passer par un fichier intermédiaire (comme Excel). Utile pour synchroniser les produits en temps réel.

4. **Supprimer les doublons de produits**  
   Ce fichier s'assure qu'aucun produit en double n'est présent dans la boutique Shopify en identifiant et supprimant les entrées redondantes.

5. **Supprimer les articles sans prix**  
   Ce script identifie et supprime automatiquement tous les produits dans Shopify qui n'ont pas de prix, assurant que seuls les produits valides sont affichés sur la boutique.

6. **Supprimer les produits sans image**  
   Ce fichier identifie et supprime les produits sans images associées, améliorant ainsi la qualité visuelle et la crédibilité de la boutique.

## Comment utiliser ces scripts

1. Clonez ce repository sur votre machine locale :
   ```bash
   git clone https://github.com/votre-utilisateur/votre-repo.git
