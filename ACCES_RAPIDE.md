# 🚀 Accès Rapide - Thérapie Sensori-Motrice

## 🌐 Accéder à l'Application

### Application Web (Prête à Utiliser)
**👉 https://3000-ipwpe98o0d0bwtd5s5iz9-cbeee0f9.sandbox.novita.ai**

L'application est **déjà en ligne** et **100% fonctionnelle** !

## 👤 Comptes de Test

### 🩺 Compte Thérapeute
```
Email : therapist@example.com
Mot de passe : therapist123
```
**Fonctionnalités** :
- Créer des créneaux de disponibilité
- Voir tous les rendez-vous
- Annuler des rendez-vous
- Gérer ses créneaux

### 👨‍⚕️ Compte Patient 1
```
Email : patient1@example.com
Mot de passe : patient123
```

### 👩‍⚕️ Compte Patient 2
```
Email : patient2@example.com
Mot de passe : patient123
```

### 👨‍💼 Compte Patient 3
```
Email : patient3@example.com
Mot de passe : patient123
```

**Fonctionnalités Patient** :
- Voir les créneaux disponibles
- Réserver un rendez-vous
- Annuler un rendez-vous
- Voir ses rendez-vous

## 📂 Code Source

### GitHub Repository
**👉 https://github.com/doriansarry47-creator/therapie-sensori-motrice**

### Télécharger le Backup
**👉 https://page.gensparksite.com/project_backups/therapie-sensori-motrice-backup.tar.gz**

## 📚 Documentation

### Pour Commencer
Ouvrez l'un de ces fichiers :
- **QUICKSTART.md** - Démarrage rapide (5 minutes)
- **README.md** - Documentation complète
- **DEPLOY_CLOUDFLARE.md** - Guide de déploiement
- **LIVRABLES.md** - Récapitulatif du projet

### Installation Locale

```bash
# 1. Cloner
git clone https://github.com/doriansarry47-creator/therapie-sensori-motrice.git
cd therapie-sensori-motrice

# 2. Installer
npm install

# 3. Préparer la DB
npm run db:reset

# 4. Build et Démarrer
npm run build
pm2 start ecosystem.config.cjs

# 5. Accéder
# http://localhost:3000
```

## 🎯 Tester Rapidement

### 1. Ouvrir l'Application
https://3000-ipwpe98o0d0bwtd5s5iz9-cbeee0f9.sandbox.novita.ai

### 2. Se Connecter en Tant que Thérapeute
- Email : `therapist@example.com`
- Mot de passe : `therapist123`
- ✅ Créer quelques créneaux

### 3. Se Déconnecter et Se Reconnecter en Patient
- Email : `patient1@example.com`
- Mot de passe : `patient123`
- ✅ Réserver un créneau

### 4. Revenir en Thérapeute
- ✅ Voir le rendez-vous réservé

## 🔧 Commandes Utiles

### Développement Local
```bash
npm run build              # Compiler
npm run dev:sandbox        # Démarrer en mode dev
npm run db:reset           # Réinitialiser la DB
```

### Déploiement Cloudflare
```bash
npm run db:migrate:prod    # Migrations production
npm run deploy             # Déployer sur Cloudflare
```

## 💡 Cas d'Usage

### Cas 1 : Patient Prend un RDV
1. Connexion patient
2. Consulter créneaux disponibles
3. Cliquer sur "Réserver"
4. ✅ RDV confirmé !

### Cas 2 : Thérapeute Crée des Créneaux
1. Connexion thérapeute
2. Remplir formulaire (date, heure début/fin)
3. Cliquer "Ajouter le créneau"
4. ✅ Créneau créé !

### Cas 3 : Annulation de RDV
1. Patient OU thérapeute
2. Voir "Mes rendez-vous"
3. Cliquer "Annuler"
4. ✅ Créneau libéré automatiquement !

## 🎨 Capture d'Écran Textuelle

```
┌─────────────────────────────────────────┐
│  🏥 Thérapie Sensori-Motrice           │
├─────────────────────────────────────────┤
│                                         │
│  [Connexion] [Inscription]              │
│                                         │
│  📧 Email : ________________            │
│  🔒 Mot de passe : _________            │
│                                         │
│  [Se Connecter]                         │
│                                         │
│  Comptes de test :                      │
│  👨‍⚕️ Thérapeute: therapist@example.com  │
│  👤 Patient: patient1@example.com       │
│                                         │
└─────────────────────────────────────────┘
```

## 🚀 Déploiement Production

### Prérequis
1. Compte Cloudflare (gratuit)
2. Clé API Cloudflare

### En 3 Étapes
```bash
# 1. Créer la DB
npx wrangler d1 create webapp-production

# 2. Mettre à jour wrangler.jsonc avec le database_id

# 3. Déployer
npm run deploy
```

**Guide complet** : Voir `DEPLOY_CLOUDFLARE.md`

## 📞 Support

### Problème ?
1. Consulter **QUICKSTART.md** section "Problèmes Courants"
2. Consulter **README.md** section complète
3. Vérifier les logs : `pm2 logs webapp`

### L'Application Ne Se Charge Pas ?
```bash
# Nettoyer et redémarrer
npm run clean-port
pm2 delete webapp
npm run build
pm2 start ecosystem.config.cjs
```

## 🎉 C'est Prêt !

L'application est **100% fonctionnelle** :
- ✅ Interface moderne et responsive
- ✅ Base de données configurée
- ✅ Comptes de test prêts
- ✅ Code source sur GitHub
- ✅ Documentation complète
- ✅ Backup sécurisé

**Commencez maintenant** : https://3000-ipwpe98o0d0bwtd5s5iz9-cbeee0f9.sandbox.novita.ai

---

**Besoin d'aide ?** Consultez la documentation complète dans README.md
