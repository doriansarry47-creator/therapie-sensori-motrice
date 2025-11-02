# ⚡ Guide de Démarrage Rapide

Ce guide vous permet de démarrer l'application en moins de 5 minutes.

## 🚀 Installation Locale

### 1. Cloner le repository

```bash
git clone https://github.com/doriansarry47-creator/therapie-sensori-motrice.git
cd therapie-sensori-motrice
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Initialiser la base de données locale

```bash
# Appliquer les migrations
npm run db:migrate:local

# Insérer les données de test
npm run db:seed
```

### 4. Compiler le projet

```bash
npm run build
```

### 5. Démarrer l'application

#### Option A : Avec PM2 (recommandé pour le développement)

```bash
# Démarrer
pm2 start ecosystem.config.cjs

# Voir les logs
pm2 logs webapp --nostream

# Arrêter
pm2 stop webapp
```

#### Option B : Avec Wrangler directement

```bash
npm run dev:sandbox
```

### 6. Accéder à l'application

Ouvrez votre navigateur : **http://localhost:3000**

## 👤 Comptes de Test

### Thérapeute
- Email : `therapist@example.com`
- Mot de passe : `therapist123`

### Patient
- Email : `patient1@example.com`
- Mot de passe : `patient123`

## 🎯 Tester les Fonctionnalités

### En tant que Thérapeute

1. Connectez-vous avec le compte thérapeute
2. Créez des créneaux disponibles
3. Consultez les rendez-vous pris par les patients
4. Annulez ou gérez les rendez-vous

### En tant que Patient

1. Connectez-vous avec le compte patient
2. Consultez les créneaux disponibles
3. Réservez un créneau
4. Consultez vos rendez-vous
5. Annulez un rendez-vous si nécessaire

## 🧪 Tester l'API

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"therapist@example.com","password":"therapist123"}'
```

### Obtenir les créneaux disponibles

```bash
curl http://localhost:3000/api/slots/available
```

### Créer un créneau (nécessite authentification)

```bash
curl -X POST http://localhost:3000/api/slots \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 1" \
  -d '{"date":"2025-11-10","start_time":"09:00","end_time":"10:00"}'
```

### Réserver un rendez-vous (nécessite authentification)

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 2" \
  -d '{"slot_id":1}'
```

## 🔧 Commandes Utiles

### Base de données

```bash
# Réinitialiser la DB locale
npm run db:reset

# Console SQL locale
npm run db:console:local

# Exemple de requête
npx wrangler d1 execute webapp-production --local \
  --command="SELECT * FROM users"
```

### Développement

```bash
# Nettoyer le port 3000
npm run clean-port

# Voir les logs PM2
pm2 logs webapp

# Redémarrer l'application
pm2 restart webapp
```

### Git

```bash
# Voir l'état
npm run git:status

# Commit rapide
npm run git:commit "Votre message"

# Voir l'historique
npm run git:log
```

## 🌐 Déploiement Production

Pour déployer sur Cloudflare Pages, consultez :
- **Guide complet** : [DEPLOY_CLOUDFLARE.md](./DEPLOY_CLOUDFLARE.md)
- **Documentation** : [README.md](./README.md)

## 🐛 Problèmes Courants

### Port 3000 déjà utilisé

```bash
npm run clean-port
# ou
fuser -k 3000/tcp
```

### Erreur de base de données

```bash
# Réinitialiser complètement
npm run db:reset
```

### PM2 ne démarre pas

```bash
# Vérifier le statut
pm2 status

# Supprimer l'ancienne instance
pm2 delete webapp

# Redémarrer
pm2 start ecosystem.config.cjs
```

### L'application ne se charge pas

1. Vérifiez que le build est fait : `npm run build`
2. Vérifiez que `dist/` existe et contient `_worker.js`
3. Vérifiez les logs : `pm2 logs webapp`

## 📚 Documentation Complète

- [README.md](./README.md) - Documentation complète
- [DEPLOY_CLOUDFLARE.md](./DEPLOY_CLOUDFLARE.md) - Guide de déploiement
- [GitHub Repository](https://github.com/doriansarry47-creator/therapie-sensori-motrice)

## 🎉 C'est Tout !

Vous êtes maintenant prêt à utiliser et personnaliser l'application !

**Questions ?** Consultez la documentation complète dans le README.
