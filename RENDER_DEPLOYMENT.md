# Render Deployment Guide

This guide will help you deploy your Instagram Clone to Render.

## Prerequisites

1. A [Render account](https://render.com) (free tier available)
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier available)
3. A [Cloudinary account](https://cloudinary.com) (free tier available)
4. Your code pushed to a GitHub repository

## Step 1: Prepare Your MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is fine)
3. Create a database user with a password
4. Whitelist all IP addresses (0.0.0.0/0) for Render access
5. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

## Step 2: Prepare Your Cloudinary Account

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Note down these values:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. Push your code (including the `render.yaml` file) to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will detect the `render.yaml` file
6. Add the required environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `CLOUD_NAME`: Your Cloudinary cloud name
   - `API_KEY`: Your Cloudinary API key
   - `API_SECRET`: Your Cloudinary API secret
7. Click "Apply" to deploy both services

### Option B: Manual Deployment

#### Deploy Backend

1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `instagram-clone-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGO_URI` = Your MongoDB connection string
   - `SECRET_KEY` = Generate a random string (or let Render auto-generate)
   - `CLOUD_NAME` = Your Cloudinary cloud name
   - `API_KEY` = Your Cloudinary API key
   - `API_SECRET` = Your Cloudinary API secret
   - `FRONTEND_URL` = (leave empty for now, add after frontend is deployed)
6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy the backend URL (e.g., `https://instagram-clone-backend.onrender.com`)

#### Deploy Frontend

1. Go to Render Dashboard
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `instagram-clone-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = Your backend URL (without https://)
     Example: `instagram-clone-backend.onrender.com`
6. Click "Create Static Site"
7. Wait for deployment to complete
8. Copy the frontend URL

#### Update Backend CORS

1. Go back to your backend service in Render
2. Add/Update the environment variable:
   - `FRONTEND_URL` = Your frontend URL (without https://)
     Example: `instagram-clone-frontend.onrender.com`
3. Save and wait for the service to redeploy

## Step 4: Verify Deployment

1. Visit your frontend URL
2. Try to register a new account
3. Upload a post with an image
4. Test other features

## Important Notes

### Free Tier Limitations

- **Backend**: Render free tier spins down after 15 minutes of inactivity
  - First request after inactivity may take 30-60 seconds
  - Consider upgrading to paid tier for production use
  
- **MongoDB Atlas**: Free tier has 512MB storage limit
  
- **Cloudinary**: Free tier has bandwidth and storage limits

### Troubleshooting

1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend
2. **Database Connection**: Verify MongoDB connection string and IP whitelist
3. **Image Upload Fails**: Check Cloudinary credentials
4. **Backend Slow**: Free tier spins down - first request is slow
5. **Build Fails**: Check build logs in Render dashboard

### Environment Variables Summary

**Backend:**
- `NODE_ENV` = production
- `PORT` = 10000
- `MONGO_URI` = Your MongoDB connection string
- `SECRET_KEY` = Random secret key for JWT
- `CLOUD_NAME` = Cloudinary cloud name
- `API_KEY` = Cloudinary API key
- `API_SECRET` = Cloudinary API secret
- `FRONTEND_URL` = Your frontend domain (without https://)

**Frontend:**
- `VITE_API_URL` = Your backend domain (without https://)

## Updating Your Deployment

Render automatically redeploys when you push to your connected branch:

1. Make changes locally
2. Commit and push to GitHub
3. Render will automatically detect changes and redeploy

## Custom Domain (Optional)

1. Go to your service settings in Render
2. Click "Custom Domain"
3. Follow instructions to add your domain
4. Update CORS settings accordingly

## Support

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
