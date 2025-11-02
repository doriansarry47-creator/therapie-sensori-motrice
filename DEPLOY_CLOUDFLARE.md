# 🚀 Guide de Déploiement Cloudflare Pages

Ce guide vous aidera à déployer votre application de thérapie sensori-motrice sur Cloudflare Pages.

## ⚠️ Prérequis

Avant de commencer, vous aurez besoin de :

1. **Un compte Cloudflare** (gratuit)
   - Créez un compte sur https://dash.cloudflare.com/sign-up

2. **Une clé API Cloudflare valide**
   - Le token fourni (`CzvRzoyuDyc7jQWZQKmnPlND`) n'est pas valide
   - Suivez les étapes ci-dessous pour en créer un nouveau

## 📝 Étape 1 : Créer une clé API Cloudflare

1. Connectez-vous à votre compte Cloudflare : https://dash.cloudflare.com/
2. Allez dans "My Profile" (en haut à droite)
3. Cliquez sur "API Tokens" dans le menu de gauche
4. Cliquez sur "Create Token"
5. Choisissez le template "Edit Cloudflare Workers"
6. OU créez un token personnalisé avec les permissions suivantes :
   - **Account** → **D1** → Edit
   - **Account** → **Cloudflare Pages** → Edit
   - **User** → **User Details** → Read
7. Cliquez sur "Continue to summary" puis "Create Token"
8. **COPIEZ VOTRE TOKEN** (vous ne pourrez plus le voir après)

## 🗄️ Étape 2 : Créer la base de données D1

Une fois votre token API configuré :

```bash
# Exporter le token dans votre terminal
export CLOUDFLARE_API_TOKEN="votre-nouveau-token-ici"

# Créer la base de données D1 en production
npx wrangler d1 create webapp-production
```

Vous obtiendrez une sortie similaire à :
```
✅ Successfully created DB 'webapp-production'!

[[d1_databases]]
binding = "DB"
database_name = "webapp-production"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**IMPORTANT** : Copiez le `database_id` !

## 🔧 Étape 3 : Configurer wrangler.jsonc

Ouvrez le fichier `wrangler.jsonc` et remplacez le `database_id` :

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "webapp",
  "compatibility_date": "2025-11-02",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": [
    "nodejs_compat"
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "webapp-production",
      "database_id": "COLLEZ-VOTRE-DATABASE-ID-ICI"  // ← Remplacez cette valeur !
    }
  ]
}
```

## 📊 Étape 4 : Appliquer les migrations en production

```bash
# Appliquer le schéma de la base de données
npm run db:migrate:prod

# Optionnel : Insérer les données de test en production
npx wrangler d1 execute webapp-production --file=./seed.sql
```

## 🌐 Étape 5 : Créer le projet Cloudflare Pages

```bash
# Créer le projet sur Cloudflare Pages
npx wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2025-11-02
```

## 🚀 Étape 6 : Déployer l'application

```bash
# Compiler le projet
npm run build

# Déployer sur Cloudflare Pages
npx wrangler pages deploy dist --project-name webapp
```

Vous obtiendrez deux URLs :
- **Production** : `https://webapp.pages.dev`
- **Branch main** : `https://main.webapp.pages.dev`

## ✅ Étape 7 : Tester le déploiement

```bash
# Tester la page d'accueil
curl https://webapp.pages.dev

# Tester l'API
curl -X POST https://webapp.pages.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"therapist@example.com","password":"therapist123"}'
```

## 🔐 Étape 8 : Configuration des secrets (optionnel)

Si vous avez besoin d'ajouter des secrets (clés API tierces, etc.) :

```bash
# Ajouter un secret
npx wrangler pages secret put API_KEY --project-name webapp

# Lister les secrets
npx wrangler pages secret list --project-name webapp
```

## 🌍 Étape 9 : Domaine personnalisé (optionnel)

Pour utiliser votre propre domaine :

1. Allez sur le dashboard Cloudflare Pages
2. Sélectionnez votre projet "webapp"
3. Cliquez sur "Custom domains"
4. Ajoutez votre domaine
5. Suivez les instructions DNS

Ou en ligne de commande :
```bash
npx wrangler pages domain add example.com --project-name webapp
```

## 🔄 Mises à jour futures

Pour déployer une nouvelle version :

```bash
# 1. Faire vos modifications
# 2. Commit sur Git
git add .
git commit -m "Vos modifications"
git push

# 3. Compiler et déployer
npm run build
npx wrangler pages deploy dist --project-name webapp
```

## 🐛 Dépannage

### Erreur "Authentication Error"
- Vérifiez que votre token API est valide
- Vérifiez que le token a les bonnes permissions
- Essayez : `npx wrangler logout` puis `npx wrangler login`

### Erreur "Database not found"
- Vérifiez que le `database_id` dans `wrangler.jsonc` est correct
- Vérifiez que la base de données existe : `npx wrangler d1 list`

### Erreur de migration
- Vérifiez que les migrations sont dans le dossier `migrations/`
- Essayez de les appliquer manuellement :
  ```bash
  npx wrangler d1 execute webapp-production --file=./migrations/0001_initial_schema.sql
  ```

### L'application ne se charge pas
- Vérifiez les logs : `npx wrangler pages deployment tail`
- Vérifiez que le build a réussi : `npm run build`
- Vérifiez que `dist/_worker.js` existe

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez la documentation Cloudflare : https://developers.cloudflare.com/pages/
2. Vérifiez les logs : `npx wrangler pages deployment tail`
3. Forum Cloudflare : https://community.cloudflare.com/

## 🎉 Félicitations !

Votre application est maintenant déployée sur Cloudflare Pages avec :
- ✅ Edge computing global
- ✅ HTTPS automatique
- ✅ Base de données D1 distribuée
- ✅ Déploiement instantané
- ✅ Scaling automatique
- ✅ Gratuit jusqu'à 100 000 requêtes/jour

---

**Besoin d'aide ?** Consultez la documentation complète dans le `README.md`
