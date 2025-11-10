# Instagram Clone

A full-stack Instagram clone built with React (Frontend) and Node.js/Express (Backend).

## Features

- ✅ User Authentication (Register, Login, Logout)
- ✅ Create Posts with Images and Captions
- ✅ Like/Unlike Posts
- ✅ Comment on Posts
- ✅ Follow/Unfollow Users
- ✅ User Profiles with Edit Functionality
- ✅ Direct Messaging
- ✅ Bookmark Posts
- ✅ Feed with All Posts
- ✅ Suggested Users

## Tech Stack

### Frontend
- React 19
- React Router
- Tailwind CSS
- Axios
- Sonner (Toast Notifications)
- Lucide React (Icons)

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image Storage)
- Multer (File Upload)
- Sharp (Image Optimization)

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image storage)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/v1/user/register` - Register a new user
- `POST /api/v1/user/login` - Login user
- `GET /api/v1/user/logout` - Logout user

### User
- `GET /api/v1/user/:id/profile` - Get user profile
- `POST /api/v1/user/profile/edit` - Edit profile
- `GET /api/v1/user/suggested` - Get suggested users
- `POST /api/v1/user/followorunfollow/:id` - Follow/Unfollow user

### Posts
- `POST /api/v1/post/addpost` - Create a new post
- `GET /api/v1/post/all` - Get all posts
- `GET /api/v1/post/userpost/all` - Get user's posts
- `GET /api/v1/post/:id/like` - Like a post
- `GET /api/v1/post/:id/dislike` - Unlike a post
- `POST /api/v1/post/:id/comment` - Add comment to post
- `POST /api/v1/post/:id/comment/all` - Get all comments for a post
- `DELETE /api/v1/post/delete/:id` - Delete a post
- `GET /api/v1/post/:id/bookmark` - Bookmark/Unbookmark a post

### Messages
- `POST /api/v1/message/send/:id` - Send a message
- `GET /api/v1/message/all/:id` - Get messages with a user

## Project Structure

```
InstagramClone/
├── backend/
│   ├── controllers/    # Route controllers
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middlewares/    # Custom middlewares
│   └── utils/          # Utility functions
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React contexts
│   │   └── lib/        # Utility functions
└── README.md
```

## Notes

- Make sure MongoDB is running before starting the backend
- Cloudinary credentials are required for image uploads
- The app uses HTTP-only cookies for authentication
- CORS is configured for `http://localhost:5173`

## Development

- Backend uses nodemon for auto-restart
- Frontend uses Vite for fast development
- Hot module replacement is enabled for both

## License

MIT

