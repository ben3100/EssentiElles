# 📋 CAHIER DES CHARGES - APPLICATION LIVRELLA

## 📱 PRÉSENTATION GÉNÉRALE

### Concept
**Livrella** est une application mobile de livraison par abonnement de produits essentiels du quotidien (hygiène féminine, couches bébé, lingettes, etc.) pour éviter les ruptures de stock à domicile.

### Public cible
- Femmes actives
- Jeunes mamans
- Familles avec enfants en bas âge

### Objectif principal
Permettre aux utilisateurs de créer des abonnements récurrents pour recevoir automatiquement leurs produits essentiels sans avoir à y penser.

---

## 🛠️ STACK TECHNIQUE

### Frontend
- **Framework:** React Native avec Expo SDK 54
- **Navigation:** Expo Router (file-based routing) + React Navigation 7
- **Gestion d'état:** Zustand 5.0
- **Requêtes HTTP:** Axios 1.14
- **Styling:** StyleSheet natif avec design system personnalisé
- **Polices:** Poppins (Google Fonts)
- **Icônes:** Expo Vector Icons (Ionicons)

### Backend
- **Framework:** FastAPI (Python)
- **Base de données:** MongoDB
- **Authentification:** JWT (JSON Web Tokens)
- **Hachage mot de passe:** bcrypt
- **CORS:** Activé pour communication frontend-backend
- **Validation:** Pydantic models

### Infrastructure
- **Backend:** Serveur FastAPI sur port 8001
- **Frontend:** Expo Metro Bundler sur port 3000
- **Base de données:** MongoDB local
- **Proxy:** Nginx pour routage `/api/*` vers backend

---

## 📊 ARCHITECTURE DE DONNÉES

### Modèles MongoDB

#### 1. **User (Utilisateur)**
```javascript
{
  _id: ObjectId,
  email: String (unique, requis),
  password: String (haché avec bcrypt),
  firstName: String,
  lastName: String,
  phone: String,
  role: String (enum: "customer", "admin"),
  isActive: Boolean (default: true),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### 2. **Product (Produit)**
```javascript
{
  _id: ObjectId,
  name: String (requis),
  brand: String,
  category: String (enum: "hygiene", "baby", "home", "health"),
  description: String,
  unit: String (ex: "Pack de 20", "500ml"),
  retailPrice: Float,
  subscriptionPrice: Float,
  stock: Integer,
  imageUrl: String,
  isFeatured: Boolean,
  isActive: Boolean,
  createdAt: DateTime
}
```

#### 3. **Subscription (Abonnement)**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (référence User),
  productId: ObjectId (référence Product),
  frequency: String (enum: "weekly", "biweekly", "monthly"),
  quantity: Integer,
  addressId: ObjectId (référence Address),
  totalPrice: Float,
  status: String (enum: "active", "paused", "cancelled"),
  startDate: DateTime,
  nextDeliveryDate: DateTime,
  createdAt: DateTime
}
```

#### 4. **Order (Commande)**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (référence User),
  orderNumber: String (unique, ex: "LVR-20250405-001"),
  items: [
    {
      productId: ObjectId,
      productName: String,
      quantity: Integer,
      price: Float
    }
  ],
  total: Float,
  deliveryAddress: Object (copie de l'adresse),
  status: String (enum: "confirmed", "preparing", "shipped", "delivered", "cancelled"),
  trackingNumber: String,
  timeline: [
    {
      status: String,
      timestamp: DateTime,
      message: String
    }
  ],
  createdAt: DateTime
}
```

#### 5. **Address (Adresse)**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (référence User),
  label: String (ex: "Domicile", "Bureau"),
  street: String,
  city: String,
  postalCode: String,
  country: String,
  isDefault: Boolean,
  createdAt: DateTime
}
```

#### 6. **Invoice (Facture)**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (référence User),
  orderId: ObjectId (référence Order),
  invoiceNumber: String (unique),
  amount: Float,
  status: String (enum: "paid", "pending", "overdue"),
  dueDate: DateTime,
  paidAt: DateTime,
  createdAt: DateTime
}
```

#### 7. **SupportTicket (Ticket Support)**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (référence User),
  subject: String,
  category: String (enum: "order", "subscription", "payment", "other"),
  status: String (enum: "open", "in_progress", "resolved", "closed"),
  messages: [
    {
      senderId: ObjectId,
      senderRole: String,
      message: String,
      timestamp: DateTime
    }
  ],
  createdAt: DateTime
}
```

#### 8. **Notification (Notification)**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (référence User),
  title: String,
  message: String,
  type: String (enum: "order", "subscription", "promo", "system"),
  isRead: Boolean,
  createdAt: DateTime
}
```

#### 9. **Offer (Offre promotionnelle)**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  discount: Float (pourcentage),
  validUntil: DateTime,
  isActive: Boolean,
  createdAt: DateTime
}
```

#### 10. **FAQ (Questions fréquentes)**
```javascript
{
  _id: ObjectId,
  question: String,
  answer: String,
  category: String,
  order: Integer (pour le tri),
  isActive: Boolean
}
```

---

## 🔌 API BACKEND - ENDPOINTS

### Base URL
- Tous les endpoints sont préfixés par `/api`
- Backend accessible sur `http://localhost:8001/api`

### 🔐 Authentification

#### `POST /api/auth/register`
Inscription d'un nouvel utilisateur
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+33612345678"
}

Response:
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  },
  "token": "eyJ..."
}
```

#### `POST /api/auth/login`
Connexion utilisateur
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {...},
  "token": "eyJ..."
}
```

#### `GET /api/auth/me`
Récupérer l'utilisateur connecté (nécessite token)
```json
Headers: { "Authorization": "Bearer <token>" }

Response:
{
  "id": "...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer"
}
```

#### `PUT /api/auth/me`
Mettre à jour le profil utilisateur
```json
Request:
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+33612345678"
}
```

### 📦 Produits

#### `GET /api/products`
Liste tous les produits actifs
```json
Query params (optionnel):
  - category: string
  - search: string
  - featured: boolean

Response:
[
  {
    "id": "...",
    "name": "Serviettes hygiéniques Ultra",
    "brand": "Always",
    "category": "hygiene",
    "description": "...",
    "unit": "Pack de 20",
    "retailPrice": 8.99,
    "subscriptionPrice": 7.49,
    "stock": 150,
    "imageUrl": "...",
    "isFeatured": true
  }
]
```

#### `GET /api/products/{id}`
Détails d'un produit
```json
Response:
{
  "id": "...",
  "name": "Serviettes hygiéniques Ultra",
  "brand": "Always",
  "category": "hygiene",
  ...
}
```

#### `GET /api/products/featured`
Produits mis en avant
```json
Response: [...]
```

#### `GET /api/products/categories`
Liste des catégories
```json
Response:
[
  {
    "key": "hygiene",
    "label": "Hygiène féminine",
    "count": 5
  },
  {
    "key": "baby",
    "label": "Bébé",
    "count": 4
  }
]
```

### 🔄 Abonnements

#### `POST /api/subscriptions`
Créer un abonnement
```json
Request:
{
  "productId": "...",
  "frequency": "monthly",
  "quantity": 2,
  "addressId": "..."
}

Response:
{
  "id": "...",
  "productId": "...",
  "frequency": "monthly",
  "quantity": 2,
  "totalPrice": 14.98,
  "status": "active",
  "startDate": "2025-04-05T...",
  "nextDeliveryDate": "2025-05-05T..."
}
```

#### `GET /api/subscriptions`
Liste des abonnements de l'utilisateur
```json
Query params (optionnel):
  - status: "active" | "paused" | "cancelled"

Response: [...]
```

#### `GET /api/subscriptions/{id}`
Détails d'un abonnement
```json
Response: {...}
```

#### `PUT /api/subscriptions/{id}/pause`
Mettre en pause un abonnement
```json
Response: { "status": "paused" }
```

#### `PUT /api/subscriptions/{id}/resume`
Reprendre un abonnement
```json
Response: { "status": "active" }
```

#### `DELETE /api/subscriptions/{id}`
Annuler un abonnement
```json
Response: { "status": "cancelled" }
```

### 🛒 Commandes

#### `POST /api/orders`
Créer une commande
```json
Request:
{
  "items": [
    {
      "productId": "...",
      "quantity": 2
    }
  ],
  "addressId": "..."
}

Response:
{
  "id": "...",
  "orderNumber": "LVR-20250405-001",
  "items": [...],
  "total": 25.50,
  "status": "confirmed",
  "createdAt": "..."
}
```

#### `GET /api/orders`
Liste des commandes de l'utilisateur
```json
Response: [...]
```

#### `GET /api/orders/{id}`
Détails d'une commande avec tracking
```json
Response:
{
  "id": "...",
  "orderNumber": "LVR-20250405-001",
  "items": [...],
  "total": 25.50,
  "status": "shipped",
  "trackingNumber": "FR123456789",
  "timeline": [
    {
      "status": "confirmed",
      "timestamp": "2025-04-05T10:00:00",
      "message": "Commande confirmée"
    },
    {
      "status": "preparing",
      "timestamp": "2025-04-05T11:00:00",
      "message": "Commande en préparation"
    }
  ]
}
```

### 📍 Adresses

#### `POST /api/addresses`
Créer une adresse
```json
Request:
{
  "label": "Domicile",
  "street": "123 Rue de Paris",
  "city": "Lyon",
  "postalCode": "69001",
  "country": "France",
  "isDefault": true
}
```

#### `GET /api/addresses`
Liste des adresses de l'utilisateur
```json
Response: [...]
```

#### `PUT /api/addresses/{id}`
Modifier une adresse
```json
Request: {...}
```

#### `DELETE /api/addresses/{id}`
Supprimer une adresse
```json
Response: { "message": "Address deleted" }
```

#### `PUT /api/addresses/{id}/default`
Définir comme adresse par défaut
```json
Response: {...}
```

### 📄 Factures

#### `GET /api/invoices`
Liste des factures de l'utilisateur
```json
Response:
[
  {
    "id": "...",
    "invoiceNumber": "INV-2025-001",
    "orderId": "...",
    "amount": 25.50,
    "status": "paid",
    "dueDate": "2025-04-15",
    "createdAt": "2025-04-05"
  }
]
```

### 🎫 Support & FAQ

#### `GET /api/support/faq`
Liste des questions fréquentes
```json
Response:
[
  {
    "id": "...",
    "question": "Comment modifier mon abonnement ?",
    "answer": "Rendez-vous dans...",
    "category": "subscription"
  }
]
```

#### `POST /api/support/tickets`
Créer un ticket de support
```json
Request:
{
  "subject": "Problème de livraison",
  "category": "order",
  "message": "Ma commande n'est pas arrivée..."
}
```

#### `GET /api/support/tickets`
Liste des tickets de l'utilisateur
```json
Response: [...]
```

#### `GET /api/support/tickets/{id}`
Détails d'un ticket
```json
Response:
{
  "id": "...",
  "subject": "Problème de livraison",
  "status": "open",
  "messages": [...]
}
```

#### `POST /api/support/tickets/{id}/messages`
Ajouter un message au ticket
```json
Request:
{
  "message": "Je souhaite plus d'informations..."
}
```

#### `PUT /api/support/tickets/{id}/close`
Fermer un ticket
```json
Response: { "status": "closed" }
```

### 🔔 Notifications

#### `GET /api/notifications`
Liste des notifications
```json
Response:
[
  {
    "id": "...",
    "title": "Commande expédiée",
    "message": "Votre commande LVR-001 est en route !",
    "type": "order",
    "isRead": false,
    "createdAt": "..."
  }
]
```

#### `PUT /api/notifications/{id}/read`
Marquer comme lue
```json
Response: { "isRead": true }
```

#### `PUT /api/notifications/read-all`
Tout marquer comme lu
```json
Response: { "message": "All marked as read" }
```

### 🎁 Offres

#### `GET /api/offers`
Liste des offres actives
```json
Response:
[
  {
    "id": "...",
    "title": "Offre de bienvenue",
    "description": "15% sur votre premier abonnement",
    "discount": 15,
    "validUntil": "2025-05-01"
  }
]
```

### 👑 ADMIN - Endpoints (nécessite role: "admin")

#### `GET /api/admin/products`
Liste tous les produits (actifs et inactifs)

#### `POST /api/admin/products`
Créer un nouveau produit

#### `PUT /api/admin/products/{id}`
Modifier un produit

#### `DELETE /api/admin/products/{id}`
Supprimer un produit

#### `PUT /api/admin/products/{id}/toggle`
Activer/désactiver un produit

#### `GET /api/admin/users`
Liste tous les utilisateurs

#### `PUT /api/admin/users/{id}/toggle`
Activer/désactiver un compte utilisateur

#### `GET /api/admin/orders`
Liste toutes les commandes

#### `PUT /api/admin/orders/{id}/status`
Mettre à jour le statut d'une commande
```json
Request:
{
  "status": "shipped",
  "trackingNumber": "FR123456789"
}
```

#### `GET /api/admin/subscriptions`
Liste tous les abonnements

#### `GET /api/admin/stats`
Statistiques globales
```json
Response:
{
  "totalUsers": 125,
  "totalOrders": 450,
  "totalRevenue": 15678.50,
  "activeSubscriptions": 89
}
```

---

## 📱 FRONTEND - STRUCTURE DE L'APPLICATION

### Architecture de navigation

L'application utilise **Expo Router** (file-based routing) avec la structure suivante:

```
app/
├── index.tsx                    # Point d'entrée (splash/redirect)
├── _layout.tsx                  # Layout racine
├── (auth)/                      # Groupe auth (non authentifié)
│   ├── _layout.tsx
│   ├── splash.tsx              # Écran de démarrage
│   ├── onboarding.tsx          # Tutoriel premier lancement
│   ├── login.tsx               # Connexion
│   ├── register.tsx            # Inscription
│   └── forgot-password.tsx     # Mot de passe oublié
├── (main)/                      # Groupe principal (authentifié)
│   ├── _layout.tsx             # Tab navigation
│   ├── (home)/
│   │   ├── _layout.tsx
│   │   └── home.tsx            # Écran d'accueil
│   ├── (catalog)/
│   │   ├── _layout.tsx
│   │   ├── catalog.tsx         # Liste produits
│   │   └── [id].tsx            # Détail produit
│   ├── (subs)/
│   │   ├── _layout.tsx
│   │   ├── subscriptions.tsx   # Mes abonnements
│   │   └── plan.tsx            # Créer un abonnement
│   ├── (orders)/
│   │   ├── _layout.tsx
│   │   ├── orders.tsx          # Mes commandes
│   │   ├── tracking.tsx        # Suivi de commande
│   │   └── invoices.tsx        # Mes factures
│   ├── (profile)/
│   │   ├── _layout.tsx
│   │   ├── profile.tsx         # Profil utilisateur
│   │   ├── settings.tsx        # Paramètres
│   │   ├── addresses.tsx       # Mes adresses
│   │   ├── support.tsx         # Support & FAQ
│   │   └── ticket.tsx          # Chat ticket
│   ├── cart.tsx                # Panier
│   ├── offers.tsx              # Offres
│   └── notifications.tsx       # Notifications
└── admin/                       # Panel admin
    ├── _layout.tsx
    ├── index.tsx               # Dashboard admin
    ├── products.tsx            # Gestion produits
    ├── users.tsx               # Gestion utilisateurs
    ├── orders.tsx              # Gestion commandes
    └── subscriptions.tsx       # Gestion abonnements
```

### Navigation principale (Tabs)

L'application utilise une **Bottom Tab Navigation** avec 5 onglets:

1. **🏠 Accueil** - `/home`
2. **📦 Catalogue** - `/catalog`
3. **🔄 Abonnements** - `/subscriptions`
4. **📋 Commandes** - `/orders`
5. **👤 Profil** - `/profile`

---

## 🎨 DESIGN SYSTEM

### Palette de couleurs
```javascript
Colors = {
  primary: '#FF6B9D',           // Rose principal
  primaryLight: '#FFB3D1',      // Rose clair
  primaryPale: '#FFF0F5',       // Rose très pâle
  
  success: '#4CAF50',           // Vert succès
  warning: '#FF9800',           // Orange avertissement
  error: '#F44336',             // Rouge erreur
  info: '#2196F3',              // Bleu info
  
  textPrimary: '#1A1A1A',       // Texte principal
  textSecondary: '#666666',     // Texte secondaire
  textTertiary: '#999999',      // Texte tertiaire
  textInverse: '#FFFFFF',       // Texte sur fond foncé
  textPlaceholder: '#CCCCCC',   // Placeholder inputs
  
  surface: '#FFFFFF',           // Fond cartes
  background: '#F8F9FA',        // Fond général
  
  borderLight: '#E0E0E0',       // Bordure légère
  borderMedium: '#CCCCCC',      // Bordure moyenne
  
  overlay: 'rgba(0,0,0,0.5)'    // Overlay modal
}
```

### Typographie
```javascript
Typography = {
  h1: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold'
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold'
  },
  h3: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold'
  },
  h4: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold'
  },
  body: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular'
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular'
  }
}
```

### Espacement
```javascript
Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
}
```

### Rayons de bordure
```javascript
BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999
}
```

---

## 📱 ÉCRANS DÉTAILLÉS

### 1. **Splash Screen** (`/splash`)
- Logo Livrella animé
- Vérification de l'authentification
- Redirection vers onboarding (première visite) ou home (connecté) ou login

### 2. **Onboarding** (`/onboarding`)
- 3 slides explicatives:
  - Slide 1: "Abonnez-vous à vos essentiels"
  - Slide 2: "Recevez vos produits automatiquement"
  - Slide 3: "Ne tombez plus jamais en rupture"
- Bouton "Commencer" → login

### 3. **Login** (`/login`)
- Champs: Email, Mot de passe
- Bouton "Se connecter"
- Lien "Mot de passe oublié ?"
- Lien "Créer un compte"
- Validation des champs
- Gestion des erreurs (mauvais identifiants)

### 4. **Register** (`/register`)
- Champs: Prénom, Nom, Email, Téléphone, Mot de passe, Confirmation mot de passe
- Bouton "S'inscrire"
- Validation des champs (email valide, mots de passe identiques, etc.)
- Création du compte + connexion automatique

### 5. **Forgot Password** (`/forgot-password`)
- Champ: Email
- Bouton "Réinitialiser"
- Message de confirmation
- (Note: Backend endpoint non implémenté, UI seulement)

### 6. **Home** (`/home`)
#### Widgets:
- **Header**: Logo + icône notifications (badge si non lues)
- **Banner promotionnel**: Image avec titre "Nouvelle offre !"
- **Actions rapides**: 4 boutons
  - 📦 Parcourir le catalogue
  - 🔄 Mes abonnements
  - 🎁 Offres spéciales
  - 📞 Support client
- **Produits vedettes**: Carrousel horizontal de produits featured
- **Mes dernières commandes**: Liste des 3 dernières commandes
- **Abonnements actifs**: Nombre d'abonnements actifs

#### Fonctionnalités:
- Pull-to-refresh pour rafraîchir les données
- Navigation vers les différentes sections
- Affichage du prénom de l'utilisateur

### 7. **Catalog** (`/catalog`)
#### Fonctionnalités:
- **Barre de recherche**: Recherche par nom ou marque
- **Filtres par catégorie**: Chips horizontaux
  - Tous
  - Hygiène féminine
  - Bébé
  - Maison
  - Santé
- **Liste de produits**: Grid 2 colonnes
  - Image produit
  - Nom
  - Marque
  - Prix abonnement (mis en avant)
  - Prix détail (barré)
  - Badge "Économie X%"
- **Pull-to-refresh**
- **Scroll infini** (si pagination implémentée)

#### Interaction:
- Tap sur produit → Détail produit

### 8. **Product Detail** (`/catalog/[id]`)
#### Sections:
- **Image produit**: Grande image en haut
- **Informations**:
  - Nom du produit
  - Marque
  - Description détaillée
  - Prix détail vs Prix abonnement
  - Stock disponible
  - Unité (ex: "Pack de 20")
- **Actions**:
  - Bouton "S'abonner maintenant" (principal, rose)
  - Bouton "Ajouter au panier" (secondaire, blanc)

#### Fonctionnalités:
- Navigation vers création d'abonnement avec productId pré-rempli
- Ajout au panier (cart global state)

### 9. **Subscriptions** (`/subscriptions`)
#### Sections:
- **Header**: Titre + nombre d'abonnements actifs
- **Filtres**: Chips
  - Tous
  - Actifs
  - En pause
  - Annulés
- **Liste des abonnements**: Cartes
  - Image produit
  - Nom produit × quantité
  - Fréquence (Hebdomadaire, Mensuel, etc.)
  - Prix total
  - Prochaine livraison (date)
  - Badge statut (Actif/Pause/Annulé)
  - Boutons d'action:
    - ⏸️ Pause / ▶️ Reprendre
    - ❌ Annuler
    - ✏️ Modifier

#### Fonctionnalités:
- Pull-to-refresh
- Actions contextuelles (pause/resume/cancel)
- Navigation vers modification (plan avec données pré-remplies)
- FAB "+" pour créer un nouvel abonnement

### 10. **Create Subscription Plan** (`/subs/plan`)
#### Étapes:
1. **Sélection produit** (si pas venu depuis product detail)
2. **Fréquence de livraison**:
   - Hebdomadaire
   - Toutes les 2 semaines
   - Mensuel
3. **Quantité**: Sélecteur + / -
4. **Adresse de livraison**: Dropdown des adresses enregistrées
5. **Récapitulatif**:
   - Produit
   - Quantité
   - Fréquence
   - Prix unitaire
   - Prix total
   - Prochaine livraison estimée

#### Actions:
- Bouton "Confirmer l'abonnement"
- Navigation automatique vers liste abonnements après création

### 11. **Orders** (`/orders`)
#### Sections:
- **Header**: Titre + nombre total de commandes
- **Filtres**: Chips
  - Toutes
  - En cours
  - Livrées
  - Annulées
- **Liste des commandes**: Cartes
  - Numéro de commande (ex: LVR-20250405-001)
  - Date de commande
  - Nombre d'articles
  - Montant total
  - Badge statut (Confirmée, En préparation, Expédiée, Livrée)
  - Bouton "Suivre" (si expédiée)

#### Fonctionnalités:
- Pull-to-refresh
- Tap sur commande → Détail/Tracking
- Filtrage en temps réel

### 12. **Order Tracking** (`/orders/tracking`)
#### Sections:
- **Informations commande**:
  - Numéro de commande
  - Date
  - Montant
  - Statut actuel
- **Timeline verticale** (stepper):
  - ✓ Confirmée (date + heure)
  - ✓ En préparation (date + heure)
  - ⏳ Expédiée (en cours)
  - ○ Livrée (à venir)
- **Numéro de tracking**: Copiable
- **Liste des articles**: Mini-liste avec images
- **Adresse de livraison**: Carte avec adresse complète

#### Fonctionnalités:
- Actualisation automatique du statut
- Bouton "Rafraîchir"
- Bouton "Contacter le support" si problème

### 13. **Invoices** (`/orders/invoices`)
#### Sections:
- **Liste des factures**: Cartes
  - Numéro de facture (ex: INV-2025-001)
  - Date d'émission
  - Montant
  - Badge statut (Payée, En attente, En retard)
  - Date d'échéance
  - Bouton "Télécharger PDF" (icône)

#### Fonctionnalités:
- Pull-to-refresh
- Filtrage par statut
- Téléchargement PDF (si implémenté)

### 14. **Profile** (`/profile`)
#### Sections:
- **Header**:
  - Avatar (initiales si pas de photo)
  - Nom complet
  - Email
  - Bouton "Modifier le profil"
- **Menu**: Liste d'options
  - ⚙️ Paramètres
  - 📍 Mes adresses
  - 📄 Mes factures
  - 🎁 Offres spéciales
  - 💬 Support & FAQ
  - 🔔 Notifications
  - 👑 Panel Admin (si role = admin)
  - 🚪 Déconnexion

#### Fonctionnalités:
- Navigation vers chaque section
- Déconnexion avec confirmation

### 15. **Settings** (`/profile/settings`)
#### Sections:
- **Informations personnelles**:
  - Prénom
  - Nom
  - Téléphone
  - Bouton "Sauvegarder"
- **Préférences de notifications**:
  - Toggle "Notifications push"
  - Toggle "Emails promotionnels"
  - Toggle "SMS de livraison"
- **Sécurité**:
  - Bouton "Changer le mot de passe"
  - Bouton "Supprimer mon compte" (rouge, avec confirmation)

#### Fonctionnalités:
- Mise à jour du profil via API
- Gestion des préférences
- Suppression de compte avec confirmation

### 16. **Addresses** (`/profile/addresses`)
#### Sections:
- **Liste des adresses**: Cartes
  - Label (Domicile, Bureau, etc.)
  - Adresse complète
  - Badge "Par défaut" (si applicable)
  - Boutons:
    - ✏️ Modifier
    - 🗑️ Supprimer
    - ⭐ Définir par défaut
- **FAB "+"**: Ajouter une nouvelle adresse

#### Modal "Ajouter/Modifier adresse":
- Champs:
  - Label (ex: Domicile)
  - Rue
  - Ville
  - Code postal
  - Pays
  - Checkbox "Adresse par défaut"
- Bouton "Enregistrer"

#### Fonctionnalités:
- CRUD complet des adresses
- Une seule adresse par défaut à la fois

### 17. **Support & FAQ** (`/profile/support`)
#### Sections:
- **FAQ**: Accordion (sections pliables)
  - Catégories: Abonnements, Commandes, Paiement, Livraison, Autre
  - Questions/réponses
- **Mes tickets**: Liste des tickets de support
  - Sujet
  - Statut (Ouvert, En cours, Résolu, Fermé)
  - Date de création
  - Dernier message (aperçu)
- **FAB "+"**: Créer un nouveau ticket

#### Modal "Nouveau ticket":
- Champs:
  - Sujet
  - Catégorie (dropdown)
  - Message
- Bouton "Envoyer"

#### Fonctionnalités:
- Navigation vers chat ticket
- Création de ticket

### 18. **Ticket Chat** (`/profile/ticket`)
#### Interface:
- **Header**: Sujet du ticket + badge statut
- **Liste des messages**: Chat inversé (dernier en bas)
  - Messages utilisateur (alignés à droite, rose)
  - Messages support (alignés à gauche, gris)
  - Timestamp
  - Avatar/initiales
- **Input message**: Barre en bas
  - TextInput
  - Bouton "Envoyer"

#### Fonctionnalités:
- Envoi de messages en temps réel
- Scroll automatique vers le bas
- Bouton "Fermer le ticket" (si résolu)

### 19. **Cart** (`/cart`)
#### Sections:
- **Liste des articles**:
  - Image produit
  - Nom
  - Prix unitaire
  - Sélecteur quantité (+ / -)
  - Sous-total
  - Bouton supprimer (🗑️)
- **Résumé**:
  - Sous-total
  - Frais de livraison
  - Total
- **Adresse de livraison**: Sélection rapide
- **Bouton "Commander"** (fixe en bas)

#### États:
- Panier vide: Illustration + "Votre panier est vide"
- Panier avec articles: Liste complète

#### Fonctionnalités:
- Modification quantités
- Suppression d'articles
- Validation → création de commande
- Navigation vers orders après commande

### 20. **Offers** (`/offers`)
#### Sections:
- **Liste des offres**: Cartes colorées
  - Titre de l'offre
  - Description
  - Pourcentage de réduction
  - Validité (date limite)
  - Bouton "Profiter de l'offre"

#### Fonctionnalités:
- Pull-to-refresh
- Navigation vers produits concernés

### 21. **Notifications** (`/notifications`)
#### Sections:
- **Actions**: Bouton "Tout marquer comme lu"
- **Liste des notifications**: Cartes
  - Icône selon type (commande, abonnement, promo, système)
  - Titre
  - Message
  - Date/heure
  - Badge "Non lu" (si applicable)

#### Fonctionnalités:
- Tap sur notification → marquer comme lu + navigation contextuelle
- Tout marquer comme lu
- Pull-to-refresh

---

## 👑 PANEL ADMIN - ÉCRANS

### 22. **Admin Dashboard** (`/admin`)
#### Sections:
- **Statistiques clés**: 4 cartes
  - 👥 Total utilisateurs
  - 📦 Commandes du mois
  - 💰 Chiffre d'affaires
  - 🔄 Abonnements actifs
- **Graphiques**:
  - Évolution des ventes (si implémenté)
  - Répartition par catégorie
- **Actions rapides**:
  - Gérer les produits
  - Gérer les utilisateurs
  - Gérer les commandes
  - Gérer les abonnements

### 23. **Admin Products** (`/admin/products`)
#### Fonctionnalités:
- **Barre de recherche**: Par nom ou marque
- **Liste des produits**: Tableau
  - Image miniature
  - Nom
  - Marque
  - Catégorie
  - Prix
  - Stock
  - Statut (Actif/Inactif)
  - Actions:
    - Toggle Actif/Inactif
    - ✏️ Modifier
    - 🗑️ Supprimer
- **FAB "+"**: Ajouter un produit

#### Modal "Ajouter/Modifier produit":
- Champs:
  - Nom
  - Marque
  - Catégorie (dropdown)
  - Description
  - Unité
  - Prix détail
  - Prix abonnement
  - Stock
  - URL image
  - Checkbox "Produit vedette"
  - Checkbox "Actif"
- Bouton "Enregistrer"

### 24. **Admin Users** (`/admin/users`)
#### Fonctionnalités:
- **Barre de recherche**: Par nom ou email
- **Liste des utilisateurs**: Cartes
  - Avatar (initiales)
  - Nom complet
  - Email
  - Date d'inscription
  - Rôle (Client/Admin)
  - Statut (Actif/Inactif)
  - Toggle Actif/Inactif (si non admin)

### 25. **Admin Orders** (`/admin/orders`)
#### Fonctionnalités:
- **Filtres par statut**: Chips (Toutes, Confirmées, En préparation, etc.)
- **Liste des commandes**: Cartes
  - Numéro de commande
  - Client (nom)
  - Date
  - Montant
  - Statut actuel
  - Bouton "Changer statut"

#### Modal "Changer statut":
- Sélection du nouveau statut:
  - Confirmée
  - En préparation
  - Expédiée (avec champ tracking number)
  - Livrée
  - Annulée
- Bouton "Confirmer"

### 26. **Admin Subscriptions** (`/admin/subscriptions`)
#### Fonctionnalités:
- **Statistiques**: 3 cartes (Actifs, En pause, Annulés)
- **Filtres par statut**: Chips
- **Liste des abonnements**: Cartes
  - Client (nom)
  - Produit
  - Fréquence
  - Quantité
  - Prix total
  - Date de début
  - Prochaine livraison
  - Statut

---

## 🔐 GESTION DE L'AUTHENTIFICATION

### Système JWT
- **Token généré** lors du login/register
- **Stockage** dans AsyncStorage
- **Header Authorization** pour toutes les requêtes authentifiées
- **Middleware backend** pour vérifier le token
- **Expiration** du token (géré côté backend)

### Context d'authentification
```javascript
AuthContext fournit:
- user: Objet utilisateur connecté (null si déconnecté)
- token: JWT token
- login(email, password): Fonction de connexion
- register(data): Fonction d'inscription
- logout(): Fonction de déconnexion
- updateProfile(data): Mise à jour profil
- isLoading: État de chargement
```

### Protection des routes
- Routes `(auth)/*` → Accessibles uniquement si non connecté
- Routes `(main)/*` → Accessibles uniquement si connecté
- Routes `admin/*` → Accessibles uniquement si role = "admin"
- Redirection automatique selon le statut

---

## 🎨 COMPOSANTS RÉUTILISABLES

### 1. **StatusBadge**
Affiche un badge coloré selon le statut
```jsx
<StatusBadge status="active" small={false} />
```
Statuts supportés: active, paused, cancelled, confirmed, preparing, shipped, delivered, paid, pending, open, closed

### 2. **SafeAreaSection**
Wrapper avec SafeAreaView et ScrollView
```jsx
<SafeAreaSection>
  {/* Contenu */}
</SafeAreaSection>
```

### 3. **ProductCard**
Carte produit pour les listes
```jsx
<ProductCard 
  product={productData}
  onPress={() => navigation.navigate('product', { id })}
/>
```

### 4. **LoadingSpinner**
Indicateur de chargement centré
```jsx
<LoadingSpinner color={Colors.primary} />
```

### 5. **EmptyState**
État vide avec illustration
```jsx
<EmptyState 
  icon="cart-outline"
  message="Votre panier est vide"
  actionText="Parcourir le catalogue"
  onAction={() => navigation.navigate('catalog')}
/>
```

---

## 📊 DONNÉES SEEDÉES (DÉMO)

### Utilisateurs
1. **Client**: sarah@example.com / password123
   - Prénom: Sarah
   - Nom: Martin
   - Rôle: customer

2. **Admin**: admin@livrella.com / Admin2026!
   - Prénom: Admin
   - Nom: Livrella
   - Rôle: admin

### Produits (12 produits)
#### Catégorie: Hygiène féminine
1. Serviettes Always Ultra (Pack de 20) - 7.49€
2. Tampons Tampax Pearl (Pack de 18) - 6.99€
3. Protège-slips Carefree (Pack de 30) - 4.99€

#### Catégorie: Bébé
4. Couches Pampers Taille 4 (Pack de 50) - 24.99€
5. Lingettes WaterWipes (Pack de 60) - 5.99€
6. Couches Huggies Taille 3 (Pack de 40) - 19.99€

#### Catégorie: Maison
7. Papier toilette Lotus (Pack de 12) - 8.99€
8. Mouchoirs Kleenex (Pack de 10) - 6.49€

#### Catégorie: Santé
9. Vitamines PreNatal (30 comprimés) - 12.99€
10. Paracétamol (20 comprimés) - 3.99€
11. Thermomètre digital - 9.99€
12. Masques chirurgicaux (Pack de 50) - 7.99€

### FAQ (Questions fréquentes)
- "Comment créer un abonnement ?"
- "Comment modifier mon abonnement ?"
- "Quels sont les modes de paiement acceptés ?"
- "Comment suivre ma commande ?"
- "Que faire si un produit est défectueux ?"

---

## 🚀 FONCTIONNALITÉS IMPLÉMENTÉES

### ✅ Authentification complète
- Inscription
- Connexion
- Déconnexion
- Récupération du profil
- Mise à jour du profil
- Protection des routes

### ✅ Gestion des produits
- Liste des produits avec filtres
- Recherche
- Catégories
- Produits vedettes
- Détail produit
- Admin: CRUD complet

### ✅ Système d'abonnements
- Création d'abonnement
- Liste des abonnements avec filtres
- Pause/Reprise d'abonnement
- Annulation d'abonnement
- Modification d'abonnement

### ✅ Gestion des commandes
- Création de commande
- Liste des commandes avec filtres
- Détail de commande
- Tracking avec timeline
- Admin: mise à jour statut

### ✅ Panier d'achat
- Ajout/retrait de produits
- Modification quantités
- Calcul du total
- Validation commande

### ✅ Gestion des adresses
- CRUD complet
- Adresse par défaut
- Sélection pour livraison

### ✅ Support client
- FAQ avec accordion
- Création de tickets
- Chat tickets
- Liste des tickets
- Fermeture de ticket

### ✅ Notifications
- Liste des notifications
- Marquer comme lu
- Tout marquer comme lu
- Badge notifications non lues

### ✅ Factures
- Liste des factures
- Affichage détails

### ✅ Offres promotionnelles
- Liste des offres actives

### ✅ Panel Admin
- Dashboard avec statistiques
- Gestion produits (CRUD)
- Gestion utilisateurs
- Gestion commandes
- Gestion abonnements

---

## 📦 DÉPENDANCES PRINCIPALES

### Frontend
```json
{
  "expo": "54.0.33",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo-router": "~6.0.22",
  "@react-navigation/native": "^7.1.6",
  "@react-navigation/bottom-tabs": "^7.3.10",
  "axios": "^1.14.0",
  "zustand": "^5.0.12",
  "@expo-google-fonts/poppins": "^0.4.1",
  "@react-native-async-storage/async-storage": "^3.0.2",
  "expo-linear-gradient": "^55.0.11"
}
```

### Backend
```
fastapi
uvicorn[standard]
motor (MongoDB async driver)
pymongo
pydantic
python-jose[cryptography] (JWT)
passlib[bcrypt] (hachage mots de passe)
python-multipart
python-dotenv
```

---

## 🔄 FLUX UTILISATEUR TYPIQUE

### Premier lancement
1. **Splash screen** (2s)
2. **Onboarding** (3 slides)
3. **Login/Register**
4. **Home** (connecté)

### Créer un abonnement
1. **Home** → "Parcourir le catalogue"
2. **Catalog** → Recherche/Filtre produit
3. **Product Detail** → "S'abonner"
4. **Create Plan** → Choix fréquence, quantité, adresse
5. **Confirmation** → Retour vers **Subscriptions**

### Passer une commande
1. **Catalog** → Produit → "Ajouter au panier"
2. Répéter pour d'autres produits
3. **Cart** → Vérifier articles
4. **Cart** → "Commander"
5. **Orders** → Voir la nouvelle commande

### Gérer un abonnement
1. **Subscriptions** → Sélectionner abonnement
2. Actions: **Pause** / **Resume** / **Cancel** / **Modify**
3. Confirmation

### Contacter le support
1. **Profile** → "Support & FAQ"
2. **Support** → Consulter FAQ ou créer ticket
3. **Ticket Chat** → Envoyer messages
4. Réponse du support
5. **Close ticket** quand résolu

---

## 🎯 AMÉLIORATIONS FUTURES (NON IMPLÉMENTÉES)

### Fonctionnalités suggérées
- [ ] Paiement en ligne (Stripe/PayPal)
- [ ] Notifications push réelles (Expo Notifications)
- [ ] Partage de produits (réseaux sociaux)
- [ ] Programme de parrainage
- [ ] Système de points de fidélité
- [ ] Historique des paiements
- [ ] Export factures en PDF
- [ ] Chat en direct avec support
- [ ] Recommandations personnalisées (IA)
- [ ] Multi-langue (i18n)
- [ ] Mode sombre
- [ ] Biométrie pour connexion
- [ ] Géolocalisation pour livraison
- [ ] Notifications email automatiques
- [ ] Analytics admin avancés
- [ ] Gestion des stocks en temps réel
- [ ] Code promo et coupons
- [ ] Wishlist

---

## 📝 NOTES TECHNIQUES

### Variables d'environnement

#### Frontend (`/app/frontend/.env`)
```
EXPO_PACKAGER_PROXY_URL=...
EXPO_PACKAGER_HOSTNAME=...
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
EXPO_USE_FAST_RESOLVER=1
METRO_CACHE_ROOT=/app/frontend/.metro-cache
```

#### Backend (`/app/backend/.env`)
```
MONGO_URL=mongodb://localhost:27017/livrella
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

### Base de données
- **Nom**: livrella
- **Collections**: users, products, subscriptions, orders, addresses, invoices, support_tickets, notifications, offers, faq

### Ports
- Frontend: 3000
- Backend: 8001
- MongoDB: 27017

### Sécurité
- Mots de passe hachés avec bcrypt (salt rounds: 12)
- Tokens JWT avec expiration 7 jours
- CORS activé pour communication frontend-backend
- Validation des données avec Pydantic

---

## ✅ CHECKLIST COMPLÉTUDE

### Backend
- [x] Authentification (register, login, me, update)
- [x] Produits (CRUD, featured, categories, search)
- [x] Abonnements (CRUD, pause, resume, cancel)
- [x] Commandes (create, list, detail, tracking)
- [x] Adresses (CRUD, default)
- [x] Factures (list)
- [x] Support (FAQ, tickets, messages)
- [x] Notifications (list, read, read-all)
- [x] Offres (list)
- [x] Admin (products, users, orders, subscriptions, stats)
- [x] Seeding initial (users, products, FAQ)

### Frontend
- [x] Splash & Onboarding
- [x] Auth (login, register, forgot-password)
- [x] Home avec widgets
- [x] Catalogue avec recherche/filtres
- [x] Détail produit
- [x] Création abonnement
- [x] Liste abonnements avec actions
- [x] Liste commandes
- [x] Tracking commande
- [x] Factures
- [x] Panier d'achat
- [x] Profil utilisateur
- [x] Paramètres
- [x] Gestion adresses
- [x] Support & FAQ
- [x] Chat tickets
- [x] Notifications
- [x] Offres
- [x] Panel Admin (dashboard, products, users, orders, subs)
- [x] Navigation (tabs + stack)
- [x] Design system cohérent
- [x] Gestion d'état (Zustand + Context)
- [x] Composants réutilisables

---

## 📞 SUPPORT & CONTACT

Pour toute question sur le projet Livrella:
- Consultez la documentation technique dans le code
- Vérifiez les fichiers `test_result.md` et `test_credentials.md`
- Utilisez les identifiants de test pour explorer l'application

---

**Date de création**: 5 avril 2025  
**Version**: 1.0.0  
**Statut**: MVP Complet - Prêt pour tests

---

*Ce cahier des charges décrit l'état actuel de l'application Livrella telle qu'implémentée. Toutes les fonctionnalités listées sont opérationnelles et testables.*
