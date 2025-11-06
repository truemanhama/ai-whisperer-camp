# Vercel Deployment Guide

This guide will help you deploy the AI Whisperer Camp application to Vercel with Firebase integration.

## Prerequisites

1. A Firebase project set up with Firestore enabled
2. A Vercel account (free tier works fine)

## Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ next to "Project Overview" → **Project Settings**
4. Scroll down to **"Your apps"** section
5. If you don't have a web app yet:
   - Click **"Add app"** → Select **Web** (</> icon)
   - Register your app with a nickname (e.g., "AI Whisperer Camp")
   - Click **"Register app"**
6. Copy the Firebase configuration values from the `firebaseConfig` object

## Step 2: Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development) or **"Start in production mode"** (for production)
4. Select a location for your database
5. Click **"Enable"**

### Firestore Security Rules (Recommended)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{sessionId} {
      allow read, write: if true; // Allow all for now - restrict in production
    }
    match /userProgress/{sessionId} {
      allow read, write: if true; // Allow all for now - restrict in production
    }
  }
}
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Firebase integration"
   git push origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

3. **Import your project**:
   - Click **"Add New"** → **"Project"**
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

4. **Configure Environment Variables**:
   - Before clicking "Deploy", go to **"Environment Variables"** section
   - Add each of the following variables:

   | Variable Name | Description | Example |
   |--------------|-------------|---------|
   | `VITE_FIREBASE_API_KEY` | Your Firebase API Key | `AIzaSyC...` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain | `your-project.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | Your Firebase Project ID | `your-project-id` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Your Firebase Storage Bucket | `your-project.appspot.com` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID | `123456789012` |
   | `VITE_FIREBASE_APP_ID` | Your Firebase App ID | `1:123456789012:web:abc123` |

   - Make sure to select **"Production"**, **"Preview"**, and **"Development"** environments for each variable
   - Click **"Add"** for each variable

5. **Deploy**:
   - Click **"Deploy"**
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Set Environment Variables**:
   ```bash
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_FIREBASE_AUTH_DOMAIN
   vercel env add VITE_FIREBASE_PROJECT_ID
   vercel env add VITE_FIREBASE_STORAGE_BUCKET
   vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
   vercel env add VITE_FIREBASE_APP_ID
   ```
   
   When prompted, select:
   - **Environment**: Production, Preview, and Development (select all)
   - **Value**: Paste your Firebase config value

4. **Deploy**:
   ```bash
   vercel --prod
   ```

## Step 4: Verify Deployment

1. Visit your deployed URL
2. Fill out the welcome form
3. Check Firebase Console → Firestore Database to verify data is being saved:
   - You should see a `users` collection with user data
   - You should see a `userProgress` collection with progress data

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Verify the variable names start with `VITE_` (required for Vite)
- Check the build logs in Vercel dashboard

### Firebase Connection Issues
- Verify your Firebase config values are correct
- Check that Firestore is enabled in Firebase Console
- Ensure your Firestore security rules allow read/write operations
- Check browser console for Firebase errors

### Environment Variables Not Working
- Make sure variables are set for the correct environment (Production/Preview/Development)
- Variables must start with `VITE_` to be exposed to the client-side code
- After adding new variables, you may need to redeploy

## Local Development Setup

For local development, create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
```

**Important**: Never commit `.env` files to Git! They should be in `.gitignore`.

## Security Notes

### ⚠️ Important: VITE_ Variables Are Exposed to Client

**Yes, `VITE_` variables ARE exposed in the browser** - this is how Vite works. Any variable starting with `VITE_` gets bundled into your client-side JavaScript and is visible to anyone who views your page source.

### ✅ But This Is Safe for Firebase!

**Firebase API keys are designed to be public.** They're not secret credentials. Here's why:

1. **Firebase API keys are identifiers, not secrets**: They identify your Firebase project, but don't grant access by themselves
2. **Security comes from Firestore Rules**: The real security is in your Firestore security rules, not in hiding the API key
3. **This is the standard approach**: All Firebase web apps expose their config in client-side code

### 🔒 Real Security: Firestore Security Rules

The security of your data depends on your **Firestore Security Rules**, not on hiding the API key. Here are recommended rules:

#### For Development/Testing (Current - Allows All):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{sessionId} {
      allow read, write: if true;
    }
    match /userProgress/{sessionId} {
      allow read, write: if true;
    }
  }
}
```

#### For Production (Recommended - More Secure):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{sessionId} {
      allow read: if true; // Anyone can read (for analytics)
      allow write: if request.resource.data.sessionId == sessionId; // Only write own data
    }
    
    // Progress can only be read/written by the session owner
    match /userProgress/{sessionId} {
      allow read: if true; // Anyone can read (for leaderboards, etc.)
      allow write: if request.resource.data.sessionId == sessionId; // Only write own progress
    }
  }
}
```

#### Even More Secure (If you add authentication later):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{sessionId} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.data.sessionId == sessionId;
    }
    match /userProgress/{sessionId} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.data.sessionId == sessionId;
    }
  }
}
```

### 🚫 What NOT to Expose

- **Firebase Admin SDK credentials** (server-side only - these ARE secret!)
- **Service account keys** (server-side only)
- **Any actual secrets** (API keys for paid services, database passwords, etc.)

### Summary

- ✅ **Safe to expose**: Firebase config (API key, project ID, etc.)
- ✅ **Security mechanism**: Firestore Security Rules
- ❌ **Never expose**: Admin SDK credentials, service account keys, actual secrets

## Next Steps

- Set up custom domain (optional)
- Configure Firestore security rules for production
- Set up Firebase Analytics (optional)
- Configure CORS if needed

