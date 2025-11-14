# Deploy Frontend Only to Vercel

Quick 5-minute deployment for just the frontend.

## Steps:

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Vercel config"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to: https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repo: `sahanaacbhat/mini-project`
   - Vercel will auto-detect the settings
   - Click "Deploy"

3. **Done!** 
   - You'll get a URL like: `https://mini-project-xyz.vercel.app`
   - Your frontend is live!

## Note:
The backend API calls won't work since we're only deploying the frontend. The app will load but features requiring the backend (login, posts, etc.) won't function without a live backend.

## Alternative: Deploy Frontend to Netlify

1. Go to: https://netlify.com
2. Drag and drop your `frontend` folder
3. Done! Instant deployment.
