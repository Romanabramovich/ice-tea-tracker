# Ice Tea Tracker

A beautiful, mobile-first web app for tracking daily ice tea consumption. Designed specifically for iPhone Safari with "Add to Home Screen" functionality.

## Features

- 📱 Mobile-first design optimized for iPhone
- 🎯 Simple one-tap increment/decrement tracking
- 📊 Real-time statistics with volume calculations
- 💾 Local storage for data persistence
- 🌙 Dynamic greeting based on time of day
- 📱 PWA ready for "Add to Home Screen"

## Quick Start

1. Open `frontend/index.html` in a web browser
2. For iPhone users: Open in Safari and tap "Add to Home Screen"

## Deployment

### Firebase Hosting (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in the project:
   ```bash
   firebase init hosting
   ```
   - Set public directory to `frontend`
   - Configure as single-page app: No
   - Don't overwrite index.html

4. Deploy:
   ```bash
   firebase deploy
   ```

### Alternative: GitHub Pages

1. Push code to GitHub repository
2. Go to Settings > Pages
3. Set source to "Deploy from a branch"
4. Select main branch and root folder

## File Structure

```
frontend/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── app.js             # JavaScript functionality
├── manifest.json      # PWA manifest
├── sw.js             # Service worker
└── icons/            # App icons (to be added)
```

## Customization

- Tea volume per serving: Edit `teaVolume` in `app.js` (default: 260mL)
- Colors: Modify CSS variables in `styles.css`
- Statistics: Update calculation logic in `app.js`

## Browser Support

- ✅ Safari (iOS) - Primary target
- ✅ Chrome (Android)
- ✅ Firefox
- ✅ Edge

## PWA Features

- Offline functionality
- Add to Home Screen
- App-like experience
- Local data storage 
