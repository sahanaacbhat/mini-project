# Troubleshooting Signup/Login Issues

## Quick Checks

### 1. Is the Backend Running?

Check if the backend server is running:
- Open terminal where you ran `npm run dev` in the backend folder
- You should see: `Server listen at port 8000`
- You should see: `mongodb connected successfully`

**If not running:**
```bash
cd backend
npm run dev
```

### 2. Is MongoDB Connected?

Check the backend console for:
- ✅ `mongodb connected successfully` - Good!
- ❌ `MongoDB connection error` - Problem!

**Fix MongoDB issues:**
- Local MongoDB: Make sure MongoDB service is running
- MongoDB Atlas: Check your connection string in `.env` file
- Verify `MONGO_URI` in `backend/.env` file

### 3. Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to signup/login
4. Look for error messages

**Common errors:**
- `ERR_NETWORK` - Backend not running or wrong URL
- CORS error - Backend CORS configuration issue
- 500 error - Server error (check backend console)

### 4. Test Backend Connection

Open in browser: `http://localhost:8000/`

You should see:
```json
{
  "message": "I'm coming from backend",
  "success": true
}
```

If you see this, backend is running!

### 5. Check .env File

Make sure `backend/.env` has all required variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### 6. Check Frontend API URL

Verify `frontend/src/lib/api.js` has:
```javascript
const API_URL = 'http://localhost:8000/api/v1';
```

## Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solution:** Start the backend server
```bash
cd backend
npm run dev
```

### Issue: "MongoDB connection error"
**Solution:** 
1. Check MongoDB is running (if local)
2. Verify MONGO_URI in `.env` file
3. Test connection string

### Issue: CORS Error
**Solution:** Backend CORS is already configured for `http://localhost:5173`
If you see CORS errors, make sure:
- Frontend is running on port 5173
- Backend CORS config matches frontend URL

### Issue: "Username already exists" or "Email already exists"
**Solution:** Use a different username/email or the error message will tell you which one

### Issue: "Something is missing, please check!"
**Solution:** Make sure all fields (username, email, password) are filled in

## Step-by-Step Debugging

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Wait for: `mongodb connected successfully` and `Server listen at port 8000`

2. **Start Frontend (in new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Backend:**
   - Open: `http://localhost:8000/`
   - Should show: `{"message":"I'm coming from backend","success":true}`

4. **Try Signup:**
   - Fill all fields
   - Submit
   - Check browser console (F12) for detailed errors
   - Check backend terminal for any error logs

5. **Check Errors:**
   - Browser console will show specific error messages now
   - Backend console will show server-side errors
   - Both will help identify the exact problem

## Still Having Issues?

Check the error messages in:
1. Browser console (F12 → Console tab)
2. Backend terminal output
3. Network tab in browser DevTools (check the failed request)

The improved error handling will now show specific error messages instead of just "failed".

