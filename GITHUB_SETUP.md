# GitHub Setup & Render Deployment Guide

## Your Repository
**GitHub Repo**: https://github.com/KUNAL-DEV-009/Assignment-7.git

---

## Step 1: Push Code to GitHub

### Option A: Using Command Line (PowerShell)

1. **Open PowerShell** in your project folder (`C:\Users\kunal\Desktop\Assignment 7`)

2. **Initialize Git** (if not already done):
   ```powershell
   git init
   ```

3. **Add all files**:
   ```powershell
   git add .
   ```

4. **Commit**:
   ```powershell
   git commit -m "Todo List App - Ready for deployment"
   ```

5. **Set main branch**:
   ```powershell
   git branch -M main
   ```

6. **Add remote repository**:
   ```powershell
   git remote add origin https://github.com/KUNAL-DEV-009/Assignment-7.git
   ```

7. **Push to GitHub**:
   ```powershell
   git push -u origin main
   ```
   - If prompted for credentials, use GitHub username and a Personal Access Token (not password)

### Option B: Using GitHub Desktop

1. **Download GitHub Desktop** (if not installed)
   - https://desktop.github.com/

2. **Open GitHub Desktop**
   - File → Add Local Repository
   - Select folder: `C:\Users\kunal\Desktop\Assignment 7`
   - Click "Add Repository"

3. **Connect to GitHub**
   - Click "Publish repository" button
   - Repository name: `Assignment-7`
   - Owner: `KUNAL-DEV-009`
   - Add description: "Todo List Web Application"
   - Make sure "Keep this code private" is unchecked (if you want public)
   - Click "Publish Repository"

### Option C: Using VS Code

1. **Open VS Code** in your project folder

2. **Initialize Git**
   - Click Source Control icon (left sidebar)
   - Click "Initialize Repository"
   - Stage all files (click + next to files)
   - Commit with message: "Todo List App - Ready for deployment"

3. **Push to GitHub**
   - Click "..." (three dots) → "Push" → "Add Remote"
   - Enter: `https://github.com/KUNAL-DEV-009/Assignment-7.git`
   - Click "OK"
   - Click "Push"

---

## Step 2: Verify Code is on GitHub

1. **Check your repository**: https://github.com/KUNAL-DEV-009/Assignment-7
2. You should see:
   - ✅ `index.js`
   - ✅ `package.json`
   - ✅ `views/index.ejs`
   - ✅ `public/` folder
   - ✅ `render.yaml`
   - ✅ All other files

---

## Step 3: Deploy on Render

Now that your code is on GitHub, deploy on Render:

### Quick Steps:

1. **Go to Render**
   - Visit [render.com](https://render.com)
   - Click "Get Started for Free"
   - **Sign in with GitHub** (use the same GitHub account)

2. **Create Web Service**
   - Click **"New +"** button (top right)
   - Select **"Web Service"**

3. **Connect Repository**
   - Click **"Connect GitHub"** (if not already connected)
   - Authorize Render
   - Search for `Assignment-7`
   - Select: `KUNAL-DEV-009/Assignment-7`

4. **Configure Service**
   ```
   Name: assignment-7 (or todo-list-app)
   Region: (Choose closest - US East recommended)
   Branch: main
   Root Directory: (leave empty)
   
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Create & Deploy**
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for first deployment
   - Watch build logs in real-time

6. **Access Your App**
   - Your app will be live at: `https://assignment-7.onrender.com`
   - (Or `https://YOUR_SERVICE_NAME.onrender.com`)

---

## 🎉 Done!

Your Todo List app will be live on Render!

### What Happens Next:

- ✅ **Auto-Deploy**: Every time you push to GitHub, Render auto-deploys
- ✅ **HTTPS**: Automatic SSL certificate
- ✅ **Free Tier**: No credit card needed
- ✅ **All Features Work**: Search, sort, filter, export, etc.

---

## 📝 Troubleshooting

### Issue: Git Push Fails

**Solution**:
- Use GitHub Desktop (easiest)
- Or use Personal Access Token instead of password
- Generate token: GitHub → Settings → Developer settings → Personal access tokens

### Issue: Render Can't Find Repo

**Solution**:
- Make sure repository is public, or
- Grant Render access to private repos in GitHub settings

### Issue: Build Fails on Render

**Solution**:
- Check Render build logs
- Verify all files are pushed to GitHub
- Ensure `package.json` is in root directory

---

## 🔗 Quick Links

- **Your GitHub Repo**: https://github.com/KUNAL-DEV-009/Assignment-7
- **Render Dashboard**: https://dashboard.render.com
- **Render Docs**: https://render.com/docs

