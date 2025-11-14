# Vercel Deployment Guide

Deploy your Instagram Clone to Vercel in minutes!

## Step 1: Deploy Backend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click **"Add New"** → **"Project"**
3. Import your repository: `sahanaacbhat/mini-project`
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
5. Add Environment Variables:
   - `MONGO_URI` = Your MongoDB connection string
   - `SECRET_KEY` = Any random string (e.g., `mysecretkey123`)
   - `CLOUD_NAME` = Your Cloudinary cloud name
   - `API_KEY` = Your Cloudinary API key
   - `API_SECRET` = Your Cloudinary API secret
6. Click **"Deploy"**
7. Copy your backend URL (e.g., `https://your-backend.vercel.app`)

## Step 2: Deploy Frontend to Vercel

1. In Vercel dashboard, click **"Add New"** → **"Project"**
2. Import the SAME repository again: `sahanaacbhat/mini-project`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = Your backend URL + `/api/v1`
     Example: `https://your-backend.vercel.app/api/v1`
5. Click **"Deploy"**
6. Copy your frontend URL (e.g., `https://your-frontend.vercel.app`)

## Step 3: Update Backend CORS

1. Go to your backend project in Vercel
2. Go to **Settings** → **Environment Variables**
3. Add:
   - `FRONTEND_URL` = Your frontend URL
     Example: `https://your-frontend.vercel.app`
4. Go to **Deployments** tab
5. Click the three dots on latest deployment → **"Redeploy"**

## Done! 🎉

Visit your frontend URL to use your Instagram clone!

## Quick Setup for Required Services

### MongoDB Atlas (Free - 2 minutes)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up → Create free cluster
3. Database Access → Add user with password
4. Network Access → Add IP `0.0.0.0/0`
5. Connect → Copy connection string

### Cloudinary (Free - 1 minute)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up
3. Dashboard shows: Cloud Name, API Key, API Secret

## Troubleshooting

- **CORS errors**: Make sure `FRONTEND_URL` is set in backend
- **Database errors**: Check MongoDB connection string and IP whitelist
- **Image upload fails**: Verify Cloudinary credentials
- **Build fails**: Check build logs in Vercel dashboard

## Notes

- Vercel free tier is perfect for this project
- Both frontend and backend are serverless
- No cold starts like Render
- Automatic HTTPS
- Auto-deploys on git push
