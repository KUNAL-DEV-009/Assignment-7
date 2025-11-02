# Deployment Guide

This guide provides step-by-step instructions for deploying the Todo List application to various platforms.

## Prerequisites

- Node.js installed locally
- GitHub account
- Account on your chosen deployment platform

## Pre-Deployment Checklist

- ✅ All code is committed and pushed to GitHub
- ✅ `package.json` includes all dependencies
- ✅ `.gitignore` excludes `node_modules` and `todos.json`
- ✅ Application runs locally without errors
- ✅ Port configuration uses `process.env.PORT` (already configured)

## Platform-Specific Instructions

### 1. Render (Easiest & Recommended)

**Steps:**

1. **Prepare your repository**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Visit [render.com](https://render.com) and sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your repository
   - Fill in the details:
     - **Name**: `todo-list-app` (or your choice)
     - **Region**: Choose closest to your users
     - **Branch**: `main` or `master`
     - **Root Directory**: Leave empty
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Click "Create Web Service"
   - Wait 5-10 minutes for initial deployment

3. **Access your app**
   - Your app will be live at: `https://your-app-name.onrender.com`
   - Render provides free HTTPS automatically

**Benefits**: Free tier, automatic deployments, easy setup

---

### 2. Vercel

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Or connect GitHub at [vercel.com](https://vercel.com)

3. **Configuration**
   - The `.vercel.json` file is pre-configured
   - No additional setup needed

**Benefits**: Fast deployments, excellent for static + API routes

---

### 3. Railway

**Steps:**

1. **Push to GitHub** (same as Render)

2. **Deploy on Railway**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js and deploys

3. **Customize** (optional)
   - Add custom domain in settings
   - Configure environment variables if needed

**Benefits**: Simple setup, good free tier

---

### 4. Netlify

**⚠️ Important Note**: Netlify is optimized for static sites and serverless functions, **not full Express.js applications** with EJS templates. 

**For this Todo List app, we strongly recommend Render or Railway instead.**

**Why Netlify is not ideal for this app:**
- Express with EJS requires server-side rendering (limited in serverless)
- File-based JSON storage won't work (Netlify Functions have read-only filesystem)
- Cold starts can cause delays
- Requires significant refactoring to work

**Recommended alternatives:**
- ✅ **Render** - Best choice, free tier, perfect for Express apps
- ✅ **Railway** - Simple setup, works great with Express
- ✅ **Vercel** - Good option with proper configuration

If you still want to explore Netlify deployment, see `NETLIFY_DEPLOY.md` for details, but expect to need substantial code changes.

### 5. Heroku

**Steps:**

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create and Deploy**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

4. **Open App**
   ```bash
   heroku open
   ```

**Note**: Heroku's free tier has been discontinued, but paid plans available.

---

## Post-Deployment Steps

### 1. Test Your Deployment

After deployment, test these features:
- [ ] Homepage loads correctly
- [ ] Can add a new task
- [ ] Can edit a task
- [ ] Can delete a task
- [ ] Can toggle completion
- [ ] Search functionality works
- [ ] Sort functionality works
- [ ] Filter buttons work
- [ ] Export functionality works
- [ ] Clear completed works

### 2. Update README

Update the deployment link in `README.md`:
```markdown
🔗 **Live Application**: https://your-app-name.onrender.com
```

### 3. Environment Variables (if needed)

Most platforms auto-set `PORT`, but if you need custom variables:

**Render**: Dashboard → Environment → Add Environment Variable

**Vercel**: Project Settings → Environment Variables

**Railway**: Variables tab → Add Variable

## Troubleshooting

### Issue: "Cannot GET /"

**Solution**: Ensure static middleware is after API routes in `index.js` (already fixed)

### Issue: "Module not found"

**Solution**: 
```bash
# Ensure all dependencies are in package.json
npm install --save express ejs
```

### Issue: "Port already in use"

**Solution**: The app uses `process.env.PORT || 3000`, which should work on all platforms

### Issue: Data not persisting

**Solution**: Check that `todos.json` is writable. Some platforms have read-only file systems. Consider using a database for production.

### Issue: Build fails

**Solution**: 
- Check Node.js version (platforms usually specify)
- Ensure `package.json` has correct `start` script
- Check build logs for specific errors

## Database Migration (Optional)

For production with persistent data across restarts, consider:

1. **MongoDB Atlas** (Free tier available)
2. **PostgreSQL** (via Render, Railway)
3. **SQLite** (lightweight option)

The current JSON file storage works but resets on platform restarts (free tiers).

## Support

If you encounter issues:
1. Check platform-specific logs
2. Verify all files are committed to GitHub
3. Ensure `package.json` has all dependencies
4. Test locally first with `npm start`

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs)

