# Google Authentication Deployment Guide

## ✅ Backend Changes Made

### 1. Fixed CORS Configuration
- Updated `server.js` to allow `https://focus-mate-self.vercel.app`
- Added proper credentials and headers support

### 2. Added Google OAuth Routes
- Created `/auth/google` route for token-based auth (existing frontend flow)
- Added `/auth/google/callback` for OAuth redirect URI
- Created dedicated `routes/auth.js` file

### 3. Added Passport.js Support
- Created `config/passport.js` with Google OAuth strategy
- Added session handling for OAuth flow
- Updated dependencies in `package.json`

### 4. Environment Variables
- Set `NODE_ENV=production`
- Added `CLIENT_URL=https://focus-mate-self.vercel.app`
- Added placeholder for `GOOGLE_CLIENT_SECRET`

## 🚀 Deployment Steps

### Step 1: Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Find your OAuth 2.0 Client ID: `157497217366-2icv25kdjqn4fbrek3cgo9doig0tjg7m`
4. Add these Authorized redirect URIs:
   ```
   https://focus-mate-5.onrender.com/auth/google/callback
   ```
5. Add these Authorized JavaScript origins:
   ```
   https://focus-mate-self.vercel.app
   https://focus-mate-5.onrender.com
   ```
6. Get your Client Secret and update the `.env` file

### Step 2: Update Environment Variables on Render
1. Go to your Render dashboard
2. Select your `focus-mate-5` service
3. Go to Environment tab
4. Add/Update these variables:
   ```
   NODE_ENV=production
   CLIENT_URL=https://focus-mate-self.vercel.app
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_google_console
   ```

### Step 3: Install New Dependencies
Run this command in your server directory before deploying:
```bash
npm install passport passport-google-oauth20 express-session
```

### Step 4: Deploy to Render
1. Push your changes to GitHub
2. Render will automatically redeploy
3. Check the logs for any errors

## 🧪 Testing

### Test Endpoints:
1. **Health Check**: `https://focus-mate-5.onrender.com/api/health`
2. **Auth Test**: `https://focus-mate-5.onrender.com/auth/test`
3. **Google Auth**: `https://focus-mate-5.onrender.com/auth/google` (POST with idToken)

### Frontend Testing:
1. Go to `https://focus-mate-self.vercel.app/join`
2. Click "Continue with Google"
3. Should authenticate without CORS errors

## 🔧 Troubleshooting

### If you still get CORS errors:
- Check that `CLIENT_URL` is set correctly in Render environment
- Verify Google Console has the correct origins

### If you get 404 on `/auth/google`:
- Check Render deployment logs
- Verify the auth routes file was deployed

### If Google auth fails:
- Verify `GOOGLE_CLIENT_SECRET` is set in Render
- Check Google Console redirect URIs are correct

## 📁 Files Modified:
- `server/server.js` - Added CORS, Passport, session handling
- `server/routes/auth.js` - New file with Google OAuth routes
- `server/config/passport.js` - New file with Passport strategy
- `server/package.json` - Added new dependencies
- `server/.env` - Updated environment variables

Your backend is now ready for deployment with working Google Authentication! 🎉