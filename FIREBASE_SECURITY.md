# Firebase Security Guide

## Understanding Firebase Client-Side Configuration

### The Question: Are VITE_ Variables Safe?

**Yes, `VITE_` variables are exposed to the client-side code.** Anyone can view them in the browser's developer tools or by viewing the page source.

### But Firebase API Keys Are Public by Design

Firebase is designed with the understanding that client-side configuration will be visible. Here's how it works:

#### 1. Firebase API Keys Are Not Secrets

- They're **identifiers**, not authentication credentials
- They tell Firebase which project to connect to
- They don't grant access by themselves
- They're meant to be included in client-side code

#### 2. Real Security: Firestore Security Rules

The actual security comes from **Firestore Security Rules**, which run on Firebase's servers, not in the browser.

Think of it like this:
- **API Key** = Your house address (public, anyone can see it)
- **Security Rules** = Your house locks and security system (what actually protects you)

## Current Security Setup

### What We're Using

Your app currently uses:
- Client-side Firebase SDK (exposed config is expected)
- Firestore database
- Session-based user tracking (no authentication yet)

### Current Firestore Rules (Development Mode)

If you started in "test mode", your rules probably look like this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

⚠️ **This allows anyone to read/write for 30 days** - fine for development, but you should update it!

## Recommended Security Rules

### Option 1: Session-Based (Current Implementation)

Since you're using session IDs, you can restrict access based on session:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - anyone can read, only write own data
    match /users/{sessionId} {
      allow read: if true; // Public read (for analytics)
      allow write: if request.resource.data.sessionId == sessionId;
    }
    
    // Progress collection - session-based access
    match /userProgress/{sessionId} {
      allow read: if true; // Public read (for leaderboards)
      allow write: if request.resource.data.sessionId == sessionId;
    }
  }
}
```

### Option 2: More Restrictive (Recommended for Production)

Only allow users to write their own data, and add validation:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{sessionId} {
      // Anyone can read (for analytics)
      allow read: if true;
      
      // Only allow creating/updating own session
      allow create: if request.resource.data.sessionId == sessionId
                    && request.resource.data.keys().hasAll(['name', 'grade', 'school', 'sessionId']);
      
      allow update: if request.resource.data.sessionId == sessionId;
      allow delete: if false; // Prevent deletion
    }
    
    match /userProgress/{sessionId} {
      allow read: if true;
      
      allow create: if request.resource.data.sessionId == sessionId;
      allow update: if request.resource.data.sessionId == sessionId
                    && resource.data.sessionId == sessionId; // Can only update own progress
      allow delete: if false;
    }
  }
}
```

### Option 3: Rate Limiting (Advanced)

Add rate limiting to prevent abuse:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{sessionId} {
      allow read: if true;
      allow write: if request.resource.data.sessionId == sessionId
                    && request.time < resource.data.lastWrite + duration.value(1, 's'); // Rate limit
    }
  }
}
```

## How to Update Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Build** → **Firestore Database**
4. Click on the **"Rules"** tab
5. Paste your new rules
6. Click **"Publish"**

## Testing Your Rules

Use the Firebase Console Rules Simulator:

1. In the Rules tab, click **"Rules Playground"**
2. Test different scenarios:
   - Can a user read their own data? ✅
   - Can a user write to someone else's session? ❌
   - Can a user delete data? ❌

## Additional Security Measures

### 1. Enable App Check (Optional but Recommended)

App Check helps protect your backend resources from abuse:

1. Go to Firebase Console → **Build** → **App Check**
2. Register your app
3. Configure reCAPTCHA or other providers

### 2. Set Up Firebase Hosting Rules (If Using)

If you deploy to Firebase Hosting, you can add additional security headers.

### 3. Monitor Usage

- Check **Firestore Usage** in Firebase Console
- Set up **Alerts** for unusual activity
- Monitor **Quotas** to prevent unexpected costs

## Common Security Mistakes

❌ **Don't**: Try to hide Firebase config (it won't work, and it's not needed)
❌ **Don't**: Use test mode rules in production
❌ **Don't**: Allow unrestricted write access in production
✅ **Do**: Use proper Firestore security rules
✅ **Do**: Validate data on both client and server (rules)
✅ **Do**: Monitor your Firebase usage

## Summary

- **VITE_ variables are exposed** - this is normal and expected
- **Firebase API keys are public** - they're identifiers, not secrets
- **Security comes from Firestore Rules** - configure them properly
- **Test your rules** - use the Rules Playground before deploying
- **Monitor usage** - keep an eye on your Firebase console

Your current setup is safe for development. For production, make sure to:
1. Update Firestore security rules
2. Enable App Check (optional)
3. Monitor usage and set up alerts

