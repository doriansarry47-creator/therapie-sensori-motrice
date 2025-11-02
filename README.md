# 🏥 Thérapie Sensori-Motrice - Application de Réservation

Application web complète de prise de rendez-vous pour la thérapie sensori-motrice, similaire à Doctolib.

## 🌐 URLs

- **Application Sandbox** : https://3000-ipwpe98o0d0bwtd5s5iz9-cbeee0f9.sandbox.novita.ai
- **Production Cloudflare** : À déployer
- **GitHub** : À configurer

## ✨ Fonctionnalités Complétées

### Pour les Patients
- ✅ Inscription et connexion sécurisée
- ✅ Visualisation des créneaux disponibles par date
- ✅ Réservation de rendez-vous en un clic
- ✅ Consultation de ses rendez-vous confirmés
- ✅ Annulation de rendez-vous
- ✅ Informations du thérapeute (nom, téléphone)

### Pour les Thérapeutes
- ✅ Inscription et connexion sécurisée
- ✅ Création de créneaux de disponibilité
- ✅ Gestion des créneaux (création, suppression)
- ✅ Visualisation des rendez-vous confirmés
- ✅ Informations des patients (nom, email, téléphone)
- ✅ Annulation de rendez-vous

### Fonctionnalités Techniques
- ✅ Authentification utilisateur (thérapeute/patient)
- ✅ Base de données D1 (SQLite) avec relations
- ✅ API REST complète avec Hono
- ✅ Interface responsive avec Tailwind CSS
- ✅ Gestion des conflits de créneaux
- ✅ Notifications utilisateur (succès/erreur)
- ✅ Protection contre la double réservation

## 🗄️ Architecture des Données

### Modèle de Données

#### Table `users`
```sql
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE)
- password (TEXT)
- nom (TEXT)
- prenom (TEXT)
- telephone (TEXT)
- role (TEXT: 'therapist' | 'patient')
- created_at (DATETIME)
```

#### Table `slots`
```sql
- id (INTEGER PRIMARY KEY)
- therapist_id (INTEGER FK → users.id)
- date (TEXT: YYYY-MM-DD)
- start_time (TEXT: HH:MM)
- end_time (TEXT: HH:MM)
- status (TEXT: 'available' | 'booked' | 'blocked')
- created_at (DATETIME)
```

#### Table `appointments`
```sql
- id (INTEGER PRIMARY KEY)
- slot_id (INTEGER UNIQUE FK → slots.id)
- patient_id (INTEGER FK → users.id)
- therapist_id (INTEGER FK → users.id)
- date (TEXT: YYYY-MM-DD)
- start_time (TEXT: HH:MM)
- end_time (TEXT: HH:MM)
- status (TEXT: 'confirmed' | 'cancelled' | 'completed')
- notes (TEXT)
- created_at (DATETIME)
```

### Services de Stockage
- **Cloudflare D1** : Base de données SQLite distribuée globalement
- **Mode local** : `.wrangler/state/v3/d1` pour le développement

## 📚 Guide Utilisateur

### Pour les Patients

1. **Inscription**
   - Cliquez sur "Inscription"
   - Remplissez vos informations (prénom, nom, email, téléphone)
   - Choisissez le rôle "Patient"
   - Créez un mot de passe (min. 6 caractères)

2. **Connexion**
   - Entrez votre email et mot de passe
   - Cliquez sur "Se connecter"

3. **Réserver un Rendez-vous**
   - Consultez les créneaux disponibles groupés par date
   - Cliquez sur "Réserver" pour le créneau souhaité
   - Confirmez la réservation

4. **Gérer vos Rendez-vous**
   - Visualisez vos rendez-vous confirmés dans la section "Mes rendez-vous"
   - Cliquez sur "Annuler" si vous devez annuler un rendez-vous

### Pour les Thérapeutes

1. **Inscription**
   - Cliquez sur "Inscription"
   - Remplissez vos informations professionnelles
   - Choisissez le rôle "Thérapeute"
   - Créez un mot de passe sécurisé

2. **Créer des Créneaux**
   - Dans la section "Créer des créneaux"
   - Sélectionnez une date
   - Définissez l'heure de début et de fin
   - Cliquez sur "Ajouter le créneau"

3. **Gérer vos Créneaux**
   - Visualisez tous vos créneaux disponibles
   - Supprimez les créneaux non réservés si nécessaire

4. **Consulter vos Rendez-vous**
   - Section "Mes rendez-vous" : liste de tous les RDV confirmés
   - Informations complètes du patient (nom, email, téléphone)
   - Possibilité d'annuler un rendez-vous

## 🧪 Comptes de Test

### Thérapeute
- **Email** : therapist@example.com
- **Mot de passe** : therapist123
- **Nom** : Dr. Marie Dubois
- **Téléphone** : 0601020304

### Patients
1. **Patient 1**
   - Email : patient1@example.com
   - Mot de passe : patient123
   - Nom : Jean Martin

2. **Patient 2**
   - Email : patient2@example.com
   - Mot de passe : patient123
   - Nom : Sophie Durand

3. **Patient 3**
   - Email : patient3@example.com
   - Mot de passe : patient123
   - Nom : Pierre Bernard

## 🚀 Déploiement

### État Actuel
- ✅ **Développement Local** : Fonctionnel sur port 3000
- ⏳ **Production Cloudflare** : En attente de configuration API

### Prochaines Étapes

1. **Configuration Cloudflare**
   - Aller dans l'onglet "Deploy"
   - Configurer la clé API Cloudflare
   - Créer la base de données D1 en production

2. **Déploiement Production**
   ```bash
   # Créer la base de données D1
   npx wrangler d1 create webapp-production
   
   # Mettre à jour wrangler.jsonc avec le database_id
   
   # Appliquer les migrations
   npm run db:migrate:prod
   
   # Déployer sur Cloudflare Pages
   npm run deploy
   ```

3. **Configuration GitHub**
   - Configurer l'authentification GitHub dans l'interface
   - Pousser le code sur un repository

## 🛠️ Stack Technique

### Backend
- **Hono** : Framework web ultra-léger et rapide
- **Cloudflare Workers** : Exécution edge computing
- **Cloudflare D1** : Base de données SQLite distribuée
- **TypeScript** : Typage statique

### Frontend
- **Vanilla JavaScript** : Pas de framework, performances optimales
- **Tailwind CSS** : Design system responsive
- **Font Awesome** : Icônes professionnelles
- **Axios** : Requêtes HTTP

### DevOps
- **Vite** : Build tool rapide
- **PM2** : Process manager pour le développement
- **Wrangler** : CLI Cloudflare
- **Git** : Contrôle de version

## 📦 Scripts Disponibles

```bash
# Développement
npm run dev                  # Mode développement Vite
npm run dev:sandbox          # Mode sandbox avec D1 local

# Build & Déploiement
npm run build                # Compiler le projet
npm run deploy               # Déployer sur Cloudflare Pages

# Base de données
npm run db:migrate:local     # Appliquer migrations en local
npm run db:migrate:prod      # Appliquer migrations en production
npm run db:seed              # Insérer données de test
npm run db:reset             # Réinitialiser DB locale

# Utilitaires
npm run clean-port           # Nettoyer le port 3000
```

## 🔐 Sécurité

### Implémentation Actuelle (Démo)
- Authentification basique avec mots de passe en clair
- Token d'authentification simple (ID utilisateur)

### Recommandations Production
- ⚠️ **Utiliser JWT** pour les tokens d'authentification
- ⚠️ **Hasher les mots de passe** avec bcrypt ou Argon2
- ⚠️ **HTTPS uniquement** (automatique sur Cloudflare)
- ⚠️ **Validation des entrées** côté serveur
- ⚠️ **Rate limiting** pour les API
- ⚠️ **CORS** configuré correctement

## 🎨 Interface Utilisateur

### Design
- Dégradé de couleurs bleu-indigo apaisant
- Cartes avec ombres et effets de profondeur
- Animations de transition fluides
- Responsive sur mobile, tablette et desktop
- Icônes intuitives (Font Awesome)
- Notifications toast pour le feedback utilisateur

### Parcours Utilisateur
1. Page d'authentification claire (login/register)
2. Dashboard spécifique au rôle
3. Actions en un clic
4. Confirmations pour actions critiques
5. Messages de succès/erreur explicites

## 📈 Fonctionnalités Non Implémentées

Ces fonctionnalités pourraient être ajoutées dans une version future :

- [ ] Notifications email/SMS lors de réservation
- [ ] Rappels automatiques 24h avant le RDV
- [ ] Historique des rendez-vous passés
- [ ] Notes de consultation pour le thérapeute
- [ ] Export PDF des rendez-vous
- [ ] Calendrier visuel interactif
- [ ] Récurrence de créneaux (ex: tous les lundis)
- [ ] Gestion de plusieurs thérapeutes
- [ ] Salle d'attente virtuelle
- [ ] Paiement en ligne
- [ ] Statistiques et analytics pour thérapeutes
- [ ] Gestion des indisponibilités/congés
- [ ] API publique pour intégrations tierces

## 🌟 Recommandations de Développement

### Prochaines Étapes Prioritaires

1. **Sécurité**
   - Implémenter JWT avec vérification côté serveur
   - Hasher les mots de passe avec bcrypt
   - Ajouter CSRF protection

2. **Fonctionnalités**
   - Système de notifications (email)
   - Calendrier visuel pour les créneaux
   - Gestion des récurrences

3. **UX/UI**
   - Améliorer le feedback visuel
   - Ajouter des animations de chargement
   - Mode sombre optionnel

4. **Performance**
   - Mettre en cache les créneaux disponibles
   - Pagination des rendez-vous
   - Optimiser les requêtes D1

## 📞 Support & Contact

Cette application a été développée pour faciliter la prise de rendez-vous en thérapie sensori-motrice.

**Dernière mise à jour** : 2 novembre 2025
**Version** : 1.0.0
**Statut** : ✅ Fonctionnel en développement | ⏳ En attente de déploiement production
