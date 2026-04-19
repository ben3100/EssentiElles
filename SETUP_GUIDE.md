# 🚀 Guide de Démarrage Rapide - EssentiElles (Livrella)

Ce guide vous permettra de démarrer l'application en quelques minutes.

## 📋 Résumé des Améliorations

### ✅ Corrections Effectuées

1. **Configuration de l'environnement**
   - Création du fichier `.env` pour le backend avec toutes les variables nécessaires
   - Création du fichier `frontend/.env` pour le frontend
   - Configuration MongoDB, JWT, Admin credentials

2. **Base de données enrichie**
   - Script Python `backend/seed_database.py` créé pour remplir la DB
   - **21 produits** variés avec images et descriptions détaillées
   - **4 catégories** complètes (Hygiène Féminine, Bébé, Packs Mensuels, Promotions)
   - **3 offres promotionnelles**
   - **Utilisateur de démonstration** avec données complètes
   - **1 abonnement actif** + 3 commandes + 3 factures
   - **Notifications** et **ticket de support** de démonstration

3. **Système d'authentification**
   - Backend: JWT fonctionnel, hashing bcrypt
   - Frontend: Gestion du token, AsyncStorage
   - Comptes pré-créés pour tests

## 🔧 Installation

### Prérequis

- **Node.js** 20+ et Yarn
- **Python** 3.11+
- **Docker** & Docker Compose
- **Expo CLI** : `npm install -g expo-cli`

### Étape 1: Cloner le projet

```bash
git clone git@github.com:ben3100/EssentiElles.git
cd EssentiElles
```

### Étape 2: Configuration de l'environnement

Les fichiers `.env` sont déjà créés avec les bonnes configurations. Vérifiez-les:

**Backend (`.env`):**
```bash
cat .env
```

**Frontend (`frontend/.env`):**
```bash
cat frontend/.env
```

> **Note**: Pour tester sur un appareil physique, modifiez `EXPO_PUBLIC_BACKEND_URL` dans `frontend/.env` avec l'IP locale de votre machine.

### Étape 3: Démarrer MongoDB et Backend

```bash
# Démarrer MongoDB
docker compose up -d mongodb

# Attendre que MongoDB soit prêt (environ 10-15 secondes)
sleep 15

# Vérifier que MongoDB est démarré
docker compose ps
```

### Étape 4: Installer les dépendances Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Étape 5: Remplir la base de données

```bash
# Toujours dans le dossier backend avec venv activé
python seed_database.py
```

**Vous devriez voir:**
```
🗑️  Nettoyage de la base de données...
✅ Base de données nettoyée

📁 Création des catégories...
✅ 4 catégories créées

🛍️  Création des produits...
✅ 21 produits créés

🎁 Création des offres promotionnelles...
✅ 3 offres créées

👤 Création de l'utilisateur de démonstration...
✅ Utilisateur créé: sarah@example.com / password123

... (suite)

🎉 BASE DE DONNÉES REMPLIE AVEC SUCCÈS !

🔑 Comptes de connexion:
   Admin:  admin@livrella.com / Admin2026!
   Demo:   sarah@example.com / password123
```

### Étape 6: Démarrer le Backend

```bash
# Toujours dans backend/ avec venv activé
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Le serveur démarre sur:** `http://localhost:8000`

**Documentation API:** `http://localhost:8000/docs`

### Étape 7: Démarrer le Frontend

Ouvrir un nouveau terminal:

```bash
cd frontend
yarn install
yarn start
```

Expo DevTools s'ouvre dans votre navigateur.

**Options:**
- Appuyer sur `i` pour iOS Simulator
- Appuyer sur `a` pour Android Emulator
- Scanner le QR code avec Expo Go sur votre téléphone

## 🔐 Comptes de Test

### Compte Utilisateur (avec données de démo)
- **Email:** `sarah@example.com`
- **Mot de passe:** `password123`
- **Contenu:**
  - 1 abonnement actif (Couches Pampers)
  - 3 commandes avec historique
  - 3 factures
  - 1 adresse enregistrée
  - 3 notifications
  - 1 ticket de support en cours

### Compte Admin
- **Email:** `admin@livrella.com`
- **Mot de passe:** `Admin2026!`
- **Accès:** Dashboard admin, gestion produits, utilisateurs, commandes

## 📦 Contenu de la Base de Données

### Produits (21 au total)

#### Hygiène Féminine (6 produits)
1. Serviettes Ultra Night Bio - 5.99€ (4.99€ abonnement)
2. Protège-slips Quotidiens x50 - 4.49€ (3.79€)
3. Tampons Normal x32 - 6.29€ (5.29€)
4. Serviettes Regular Day - 4.99€ (4.19€)
5. Cups Menstruelles Taille M - 24.99€
6. Lingettes Intimes Douces - 3.99€ (3.49€)

#### Bébé (8 produits)
1. Couches Taille 2 (3-6 kg) - 21.99€ (18.99€)
2. Lingettes Sensitive x288 - 11.99€ (9.99€)
3. Couches Premium Taille 3 - 24.99€ (21.49€)
4. Crème Change Protectrice - 9.99€ (8.49€)
5. Couches Taille 4 (7-18 kg) - 27.99€ (23.99€)
6. Gel Lavant Doux - 7.99€ (6.99€)
7. Lait Corps Hydratant - 8.99€ (7.99€)
8. Eau Nettoyante Sans Rinçage - 6.99€ (5.99€)

#### Packs Mensuels (3 produits)
1. Pack Essentiel Femme - 12.99€ (10.99€)
2. Pack Bébé Complet - 39.99€ (34.99€)
3. Pack Hygiène Complète - 19.99€ (16.99€)

#### Promotions (2 produits)
1. Lot 3 Serviettes Night PROMO - 14.99€
2. Pack Découverte Bébé - 19.99€ (14.99€)

### Catégories
- Hygiène Féminine (rose #FFCAD4)
- Bébé (vert #E8F5E9)
- Packs Mensuels (violet #F3E5F5)
- Promotions (orange #FFF3E0)

### Offres Promotionnelles
- -20% sur votre 1ère commande
- Livraison gratuite (tous les abonnements)
- 3 mois = 1 mois offert

## 🧪 Tester l'Application

### Test Complet du Flux Utilisateur

1. **Inscription**
   - Ouvrir l'app
   - Cliquer sur "S'inscrire"
   - Remplir le formulaire
   - ✅ Compte créé et connecté automatiquement

2. **Connexion (compte demo)**
   - Email: `sarah@example.com`
   - Mot de passe: `password123`
   - ✅ Vous voyez l'écran d'accueil

3. **Explorer les produits**
   - Catalogue complet avec filtres par catégorie
   - Recherche par nom ou marque
   - Produits en vedette

4. **Voir l'abonnement actif**
   - Aller dans "Mes abonnements"
   - ✅ 1 abonnement aux Couches Pampers
   - Voir détails, modifier, mettre en pause

5. **Historique des commandes**
   - Aller dans "Commandes"
   - ✅ 3 commandes avec statuts différents
   - Tracking disponible pour les commandes récentes

6. **Notifications**
   - Icône notification en haut à droite
   - ✅ 3 notifications (livraison, abonnement, promo)

7. **Support**
   - Aller dans "Support"
   - FAQ disponible
   - ✅ 1 ticket en cours avec réponse du support

## 🔍 Endpoints API Principaux

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/me` - Mettre à jour le profil
- `PUT /api/auth/me/password` - Changer le mot de passe

### Produits
- `GET /api/products` - Liste des produits (avec filtres)
- `GET /api/products/featured` - Produits en vedette
- `GET /api/products/{id}` - Détails d'un produit
- `GET /api/categories` - Liste des catégories

### Abonnements
- `GET /api/subscriptions` - Mes abonnements
- `POST /api/subscriptions` - Créer un abonnement
- `PUT /api/subscriptions/{id}` - Modifier
- `POST /api/subscriptions/{id}/pause` - Mettre en pause
- `POST /api/subscriptions/{id}/resume` - Reprendre
- `DELETE /api/subscriptions/{id}` - Annuler

### Commandes
- `GET /api/orders` - Historique des commandes
- `GET /api/orders/{id}` - Détails d'une commande
- `POST /api/orders` - Créer une commande

### Support
- `GET /api/support/faq` - FAQ
- `GET /api/support/tickets` - Mes tickets
- `POST /api/support/tickets` - Créer un ticket
- `POST /api/support/tickets/{id}/messages` - Ajouter un message

### Admin (nécessite role="admin")
- `GET /api/admin/dashboard` - Statistiques
- `GET /api/admin/users` - Liste des utilisateurs
- `GET /api/admin/orders` - Toutes les commandes
- `POST /api/admin/products` - Créer un produit
- `PUT /api/admin/products/{id}` - Modifier un produit

**Documentation complète:** http://localhost:8000/docs

## 🐛 Problèmes Résolus

### 1. Variables d'environnement manquantes
**Avant:** Aucun fichier `.env`, variables non définies
**Après:** Fichiers `.env` créés avec toutes les variables nécessaires

### 2. Base de données vide
**Avant:** Pas de données de test, impossible de tester l'app
**Après:** Script `seed_database.py` avec 21 produits, utilisateur demo, commandes, etc.

### 3. Configuration API frontend
**Avant:** URL API mal configurée
**Après:** Variable `EXPO_PUBLIC_BACKEND_URL` correctement définie

### 4. Authentification
**Avant:** Potentiels problèmes de token
**Après:** JWT configuré correctement, storage token testé

## 📱 Test sur Appareil Physique

Pour tester sur votre téléphone:

1. **Installer Expo Go** sur votre smartphone
   - iOS: App Store
   - Android: Google Play

2. **Modifier l'URL de l'API** dans `frontend/.env`:
   ```bash
   # Remplacer par l'IP locale de votre machine
   EXPO_PUBLIC_BACKEND_URL=http://192.168.1.XXX:8000
   ```
   
   Pour trouver votre IP:
   - **Mac/Linux:** `ifconfig | grep "inet "` ou `ip addr show`
   - **Windows:** `ipconfig`

3. **Relancer le serveur frontend**:
   ```bash
   yarn start
   ```

4. **Scanner le QR code** avec Expo Go

## 🚀 Prochaines Étapes

### Pour le Développement

1. **Améliorer le Design**
   - Consulter `design_guidelines.json`
   - Appliquer les couleurs et styles du design system

2. **Ajouter des Vraies Images**
   - Remplacer les URLs Unsplash/Pexels par vos images
   - Uploader dans `frontend/assets/images/`

3. **Intégration Paiement**
   - Configurer Stripe (clés dans `.env`)
   - Implémenter le flux de paiement

4. **Notifications Push**
   - Configurer Expo Notifications
   - Backend: envoyer des notifications push

5. **Tests**
   - Backend: `cd backend && pytest`
   - Frontend: `cd frontend && yarn test`

### Pour la Production

1. **Sécurité**
   - Changer `JWT_SECRET` dans `.env`
   - Changer les mots de passe admin
   - Configurer HTTPS/SSL

2. **Déploiement Backend**
   - Deploy sur Railway, Render, ou AWS
   - Configurer MongoDB Atlas (cloud)

3. **Déploiement Mobile**
   - Build Android: `eas build --platform android`
   - Build iOS: `eas build --platform ios`
   - Submit aux stores

## 📞 Support

- **Email:** bdjbend@gmail.com
- **GitHub:** https://github.com/ben3100/EssentiElles

## 🎉 C'est Prêt!

Votre application EssentiElles est maintenant configurée et prête à être utilisée!

**Bon développement! 🚀**
