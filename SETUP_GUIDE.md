# Setup Guide - Instagram Clone

## Quick Start Checklist

### 1. Backend Setup

#### Step 1: Create `.env` file in `backend/` folder

Create a file named `.env` in the `backend` directory with the following:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key_here_make_it_long_and_random
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

**How to get these values:**

1. **MONGO_URI**: 
   - Local MongoDB: `mongodb://localhost:27017/instagram_clone`
   - MongoDB Atlas: Get connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **SECRET_KEY**: 
   - Generate a random string for JWT signing
   - Example: `openssl rand -base64 32` or use any long random string

3. **Cloudinary Credentials**: 
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Get your `CLOUD_NAME`, `API_KEY`, and `API_SECRET` from the dashboard

#### Step 2: Install dependencies and run

```bash
cd backend
npm install
npm run dev
```

You should see: `Server listen at port 8000` and `mongodb connected successfully`

### 2. Frontend Setup

#### Step 1: Install dependencies

```bash
cd frontend
npm install
```

#### Step 2: Run the development server

```bash
npm run dev
```

The frontend will open at `http://localhost:5173`

### 3. Test the Application

1. **Register a new account** at `http://localhost:5173/signup`
2. **Login** with your credentials
3. **Create a post** with an image
4. **Like and comment** on posts
5. **Follow other users** from the Messages page
6. **Send messages** to other users
7. **Bookmark posts**
8. **Edit your profile**

## Troubleshooting

### Backend Issues

- **MongoDB connection error**: Make sure MongoDB is running or your Atlas connection string is correct
- **Cloudinary error**: Verify your Cloudinary credentials are correct
- **Port already in use**: Change PORT in `.env` or kill the process using port 8000

### Frontend Issues

- **API errors**: Ensure backend is running on port 8000
- **CORS errors**: Backend CORS is configured for `http://localhost:5173`
- **Build errors**: Make sure all dependencies are installed

## Next Steps for Enhancement

Once the basic app is running, consider:

1. **Real-time features**: Add Socket.io for real-time messaging and notifications
2. **Search functionality**: Add user and post search
3. **Stories feature**: Implement Instagram-like stories
4. **Hashtags**: Add hashtag support to posts
5. **Notifications**: Implement notification system
6. **Image filters**: Add image editing features
7. **Video posts**: Support video uploads
8. **Responsive design**: Optimize for mobile devices
9. **Testing**: Add unit and integration tests
10. **Deployment**: Deploy to Vercel (frontend) and Railway/Heroku (backend)

## Production Deployment

Before deploying to production:

1. Change CORS settings to your production URL
2. Use environment variables securely
3. Add rate limiting
4. Implement proper error logging
5. Add input validation and sanitization
6. Set up SSL/HTTPS
7. Configure proper cookie settings for production

