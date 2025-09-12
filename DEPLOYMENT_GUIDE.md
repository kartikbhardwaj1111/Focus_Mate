# Google OAuth Deployment Fix Guide

## Issues Fixed:
1. ✅ API route mismatch (404 error)
2. ✅ CORS and Cross-Origin-Opener-Policy headers
3. ✅ Netlify redirects configuration
4. ✅ Environment variable setup

## Step-by-Step Deployment:

### 1. Backend Deployment (Deploy first)

**Environment Variables to set on your backend hosting platform:**
```
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-netlify-app.netlify.app
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=your-jwt-secret-key
MONGODB_URI=your-mongodb-connection-string
DEFAULT_PROFILE_PIC=https://via.placeholder.com/150
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select your project
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add these authorized origins:
   - `https://your-netlify-app.netlify.app`
   - `http://localhost:5173` (for development)
6. Add these authorized redirect URIs:
   - `https://your-netlify-app.netlify.app`
   - `http://localhost:5173`

### 3. Frontend Deployment (Deploy after backend)

**Update these files with your actual URLs:**

1. **netlify.toml** - Replace `your-backend-url.com` with your actual backend URL
2. **_redirects** - Replace `your-backend-url.com` with your actual backend URL

**Environment Variables to set in Netlify:**
```
VITE_API_URL=https://your-backend-url.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 4. Testing Checklist

- [ ] Backend health check: `GET https://your-backend-url.com/api/health`
- [ ] Frontend can reach backend: Check Network tab for API calls
- [ ] Google OAuth popup opens without CORS errors
- [ ] Authentication completes successfully

### 5. Common Issues & Solutions

**Issue: Still getting 404 on API calls**
- Verify `VITE_API_URL` is set correctly in Netlify
- Check Netlify function logs for redirect issues

**Issue: CORS errors persist**
- Ensure `CLIENT_URL` matches your Netlify URL exactly
- Check that both HTTP and HTTPS are configured if needed

**Issue: Google OAuth popup blocked**
- Verify Google Client ID is correct
- Check that authorized origins include your Netlify domain

## Quick Fix Commands:

```bash
# Backend
cd server
npm install
npm start

# Frontend  
cd frontend
npm install
npm run build
```

Deploy backend first, get the URL, then update frontend config and deploy.