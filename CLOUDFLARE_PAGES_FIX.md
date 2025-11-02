# 🔧 Fix Cloudflare Pages Deployment Error

## ❌ Error Message
```
✘ [ERROR] It looks like you've run a Workers-specific command in a Pages project.
For Pages, please run `wrangler pages deploy` instead.
```

## 🎯 Root Cause
Your Cloudflare Pages build configuration is using the **wrong deploy command**:
- **Current (WRONG)**: `npx wrangler deploy`
- **Correct**: `npx wrangler pages deploy dist --project-name webapp`

## ✅ Solution: Update Cloudflare Pages Build Settings

### Option 1: Via Cloudflare Dashboard (Recommended)

1. **Log in to Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com/
   - Navigate to **Pages** → Select your project `webapp`

2. **Update Build Configuration**
   - Go to **Settings** → **Builds & deployments**
   - Click **Edit** on Build configuration
   
3. **Update the Deploy Command**
   - **Build command**: `npm run build` (keep this)
   - **Build output directory**: `dist` (keep this)
   - **Deploy command**: Change from `npx wrangler deploy` to:
     ```bash
     npx wrangler pages deploy dist --project-name webapp
     ```
   
4. **Save and Retry Deployment**
   - Click **Save**
   - Go to **Deployments** → **Retry deployment**

### Option 2: Use package.json Script (Alternative)

The project already has the correct script defined in `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && wrangler pages deploy dist --project-name webapp"
  }
}
```

**Update the Cloudflare Pages deploy command to**:
```bash
npm run deploy
```

This will automatically build and deploy with the correct command.

### Option 3: Manual Deployment (For Testing)

If you want to deploy manually from your local machine:

```bash
# 1. Build the project
cd /home/user/webapp
npm run build

# 2. Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name webapp
```

## 📋 Complete Deployment Checklist

Before deploying, ensure you have completed these steps:

### 1. ✅ Cloudflare API Token
```bash
# Set your API token
export CLOUDFLARE_API_TOKEN="your-api-token-here"

# Or login interactively
npx wrangler login
```

### 2. ✅ Create D1 Database
```bash
# Create the production database
npx wrangler d1 create webapp-production

# Copy the database_id from the output
# It will look like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 3. ✅ Update wrangler.jsonc
Update the `database_id` in `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "webapp-production",
      "database_id": "your-actual-database-id-here"
    }
  ]
}
```

### 4. ✅ Apply Database Migrations
```bash
# Apply the schema to production database
npm run db:migrate:prod

# Optional: Seed with test data
npx wrangler d1 execute webapp-production --file=./seed.sql
```

### 5. ✅ Create Pages Project (if not exists)
```bash
# Create the Pages project
npx wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2025-11-02
```

### 6. ✅ Deploy Application
```bash
# Build and deploy
npm run deploy

# Or manually:
npm run build
npx wrangler pages deploy dist --project-name webapp
```

## 🔍 Verify Deployment

After successful deployment, you'll see:

```
✨ Deployment complete!
🌎 https://webapp.pages.dev
🌎 https://main.webapp.pages.dev
```

Test your application:

```bash
# Test homepage
curl https://webapp.pages.dev

# Test API endpoint
curl -X POST https://webapp.pages.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"therapist@example.com","password":"therapist123"}'
```

## 🐛 Common Issues

### Issue 1: "Project not found"
**Solution**: Create the project first
```bash
npx wrangler pages project create webapp
```

### Issue 2: "Database not found"
**Solution**: Check that database_id in wrangler.jsonc matches your D1 database
```bash
# List your databases
npx wrangler d1 list

# Verify the database_id matches
```

### Issue 3: "Authentication error"
**Solution**: Re-authenticate
```bash
npx wrangler logout
npx wrangler login
```

### Issue 4: "Build failed"
**Solution**: Test build locally first
```bash
npm run build
# Check that dist/_worker.js was created
ls -la dist/
```

## 📝 Summary

**The key fix is**: Change the Cloudflare Pages deploy command from:
- ❌ `npx wrangler deploy` (Workers command)
- ✅ `npx wrangler pages deploy dist --project-name webapp` (Pages command)

**Or simply use the npm script**:
```bash
npm run deploy
```

---

For detailed deployment instructions, see `DEPLOY_CLOUDFLARE.md`
