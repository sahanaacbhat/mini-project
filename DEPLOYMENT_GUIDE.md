# 🚀 Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- MongoDB Atlas (already configured)
- Cloudinary (already configured)

---

## 📦 Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/instagram-clone.git
git branch -M main
git push -u origin main
```

---

## 🔧 Step 2: Deploy Backend

### 2.1 Go to Vercel
1. Visit https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository

### 2.2 Configure Backend
- **Root Directory:** `backend`
- **Framework Preset:** Other
- **Build Command:** (leave empty)
- **Output Directory:** (leave empty)

### 2.3 Add Environment Variables
Click "Environment Variables" and add:

```
NODE_ENV=production
PORT=8000
MONGO_URI=mongodb+srv://sahanabhat:sahanacbhat@cluster0.ipdwavu.mongodb.net/?appName=Cluster0
JWT_SECRET=sahanabhat
API_KEY=466516217469614
API_SECRET=bf16EpLAPbyD8lY1mU1Sxw2KpD8
CLOUD_NAME=dfkmmahnl
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Note:** You'll update `FRONTEND_URL` after deploying frontend

### 2.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://instagram-backend-xyz.vercel.app`)

---

## 🎨 Step 3: Deploy Frontend

### 3.1 Create New Project on Vercel
1. Click "Add New" → "Project"
2. Import the SAME GitHub repository

### 3.2 Configure Frontend
- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3.3 Add Environment Variable
Click "Environment Variables" and add:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

Replace with your actual backend URL from Step 2.4

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your frontend URL (e.g., `https://instagram-clone-xyz.vercel.app`)

---

## 🔄 Step 4: Update Backend CORS

### 4.1 Update Backend Environment Variable
1. Go to your backend project on Vercel
2. Click "Settings" → "Environment Variables"
3. Find `FRONTEND_URL`
4. Update it with your frontend URL from Step 3.4
5. Click "Save"

### 4.2 Redeploy Backend
1. Go to "Deployments" tab
2. Click the three dots on latest deployment
3. Click "Redeploy"
4. Wait for redeployment

---

## ✅ Step 5: Test Your Live App

1. Visit your frontend URL
2. Register a new account
3. Login
4. Create a post
5. Test all features

**Your app is now LIVE! 🎉**

---

## 🌐 Your Live URLs

**Frontend:** `https://your-app.vercel.app`  
**Backend API:** `https://your-api.vercel.app`

Share the frontend URL with anyone!

---

## 🔧 Troubleshooting

### Issue: "Network Error" or "CORS Error"
**Solution:** 
- Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
- Redeploy backend after updating

### Issue: "Authentication Failed"
**Solution:**
- Check if `JWT_SECRET` is set in backend environment variables
- Make sure cookies are enabled in browser

### Issue: "Image Upload Failed"
**Solution:**
- Verify Cloudinary credentials in backend environment variables
- Check `CLOUD_NAME`, `API_KEY`, `API_SECRET`

### Issue: "Database Connection Failed"
**Solution:**
- Verify `MONGO_URI` is correct
- Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

---

## 🔄 Updating Your App

After making changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically redeploy both frontend and backend!

---

## 💡 Tips

1. **Custom Domain:** You can add a custom domain in Vercel settings
2. **Preview Deployments:** Every branch gets its own preview URL
3. **Logs:** Check deployment logs in Vercel dashboard for errors
4. **Analytics:** Vercel provides free analytics for your app

---

## 📊 Free Tier Limits

**Vercel:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Serverless functions (10s timeout)

**MongoDB Atlas:**
- ✅ 512MB storage
- ✅ Shared cluster

**Cloudinary:**
- ✅ 25GB storage
- ✅ 25GB bandwidth/month

Perfect for demos and portfolios!

---

## 🎓 What You've Deployed

- ✅ Full-stack MERN application
- ✅ RESTful API with authentication
- ✅ Cloud database (MongoDB Atlas)
- ✅ Cloud image storage (Cloudinary)
- ✅ HTTPS enabled
- ✅ Global CDN
- ✅ Auto-scaling serverless functions

**Congratulations! Your Instagram clone is live! 🚀**
