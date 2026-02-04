# Kebab Hut - Site Web Restaurant avec Admin

## Énoncé du Problème
Créer un site internet pour le restaurant Kebab Hut à La Rochelle avec un fond noir et un système d'administration pour modifier les photos, prix, noms et descriptions des produits.

## Architecture
- **Frontend**: React.js avec Tailwind CSS (thème noir)
- **Backend**: FastAPI avec MongoDB
- **Auth**: JWT avec email/mot de passe
- **Storage**: Upload d'images local (/uploads)

## Fonctionnalités Implémentées (Février 2025)

### Site Public
- [x] Hero section avec fond noir
- [x] Menu dynamique chargé depuis MongoDB
- [x] 6 catégories (Kebabs, Burgers, Tacos, Bowls, Frites, Boissons)
- [x] Navigation par catégories (sticky)
- [x] Badge "Populaire" sur les best-sellers
- [x] Infos pratiques (adresse, téléphone, horaires)
- [x] Boutons Commander (tel:), Itinéraire (Google Maps)
- [x] Design responsive mobile-first
- [x] Bouton flottant sur mobile

### Panneau Admin (/admin)
- [x] Authentification email/mot de passe
- [x] Inscription de nouveaux admins
- [x] Initialisation du menu par défaut
- [x] Ajout de produits avec upload photo
- [x] Modification de produits (nom, description, prix, image, populaire)
- [x] Suppression de produits
- [x] Changement de catégorie
- [x] Déconnexion

## Endpoints API
- POST /api/auth/register - Inscription
- POST /api/auth/login - Connexion
- GET /api/auth/me - Utilisateur courant
- GET /api/menu - Liste des produits (public)
- GET /api/categories - Liste des catégories
- POST /api/admin/menu - Ajouter produit
- PUT /api/admin/menu/{id} - Modifier produit
- DELETE /api/admin/menu/{id} - Supprimer produit
- POST /api/admin/upload - Upload image
- POST /api/admin/init-menu - Initialiser menu par défaut

## Accès Admin
- URL: /admin
- Créer un compte avec email/mot de passe
- Puis se connecter

## Prochaines Actions
1. Ajouter vos vraies photos de plats via l'admin
2. Configurer les vrais liens Facebook/Instagram
3. Ajouter le logo officiel Kebab Hut
4. Optionnel: Intégrer commande Uber Eats

© 2025 Kebab Hut La Rochelle
