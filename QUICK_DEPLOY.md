# Quick Deployment Guide

## ⚠️ Having Issues with Netlify?

If you're seeing "Page not found" on Netlify, **that's normal** - Netlify doesn't work well with Express + EJS apps. 

**👉 Switch to Render instead!** It's perfect for your app and takes only 5 minutes. See `SWITCH_TO_RENDER.md` for a quick guide.

---

## 🚀 Fastest Way: Render (Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `todo-list-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **"Create Web Service"**
6. Wait 5-10 minutes ⏳

### ✅ Done!

Your app will be live at: `https://todo-list-app.onrender.com`

---

## 📋 Deployment Checklist

Before deploying, ensure:

- [x] All code is committed to git
- [x] `package.json` has all dependencies
- [x] `.gitignore` excludes `node_modules` and `todos.json`
- [x] Application runs locally (`npm start`)
- [x] No errors in console

---

## 🔧 Platform-Specific Notes

### Render
- ✅ Free tier available
- ✅ Auto-deploy on git push
- ✅ HTTPS included
- ✅ Build logs available

### Vercel
- ✅ Fast deployments
- ✅ Great CDN
- ✅ Auto SSL
- Use: `vercel` CLI or GitHub integration

### Railway
- ✅ Simple setup
- ✅ Free tier (limited)
- ✅ Auto-detects Node.js
- ✅ One-click deploy

### Heroku
- ⚠️ Free tier discontinued
- ✅ Reliable platform
- ✅ Good documentation
- Use: `heroku create` + `git push heroku main`

---

## 🐛 Troubleshooting

**Issue**: Build fails
- Check Node.js version (use 14+)
- Verify `package.json` is correct
- Check build logs

**Issue**: App won't start
- Verify `PORT` is used from `process.env.PORT` ✅ (already configured)
- Check start command is `npm start` ✅ (already configured)

**Issue**: Cannot GET routes
- Ensure static middleware is after routes ✅ (already fixed)
- Check route order in `index.js`

**Issue**: Data not persisting
- Normal on free tiers (ephemeral storage)
- Consider database for production

---

## 📝 Next Steps After Deployment

1. **Test all features**:
   - Add, edit, delete tasks
   - Search, sort, filter
   - Export functionality
   - Complete/uncomplete tasks

2. **Update README** with your live URL

3. **Share your app** 🎉

---

## 💡 Tips

- Render free tier may sleep after inactivity (15 min) - first request will be slow
- Use environment variables for sensitive data (not needed for this app)
- Monitor logs in platform dashboard
- Set up auto-deploy from GitHub for convenience

---

## 📚 Full Documentation

See `DEPLOYMENT.md` for detailed instructions for all platforms.

