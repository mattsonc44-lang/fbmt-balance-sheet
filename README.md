# FBMT Agricultural Balance Sheet — Complete Setup Guide

## Overview

This app uses **Supabase** as its database — free hosted PostgreSQL.
Data is stored in the cloud so any device accesses the same client records,
year-over-year comparisons work across devices, and data is never lost.

---

## Part 1 — Set Up Supabase (One Time, ~10 min)

1. Go to **https://app.supabase.com** → create free account → New Project
   - Name: fbmt-balance-sheet
   - Region: US West (Oregon)

2. **SQL Editor** → New Query → paste contents of `supabase-schema.sql` → Run

3. **Settings → API** → copy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

4. Open `public/config.js` and fill in your values:
   ```js
   window.SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
   window.SUPABASE_ANON_KEY = 'eyJ...your anon key...';
   ```

---

## Part 2 — Build and Deploy

```bash
npm install
npm run build
```

**Netlify (free):** Drag the `dist/` folder to https://app.netlify.com
You get a live URL immediately. Add a custom domain in Netlify settings.

**netlify.toml** is already configured — just connect your GitHub repo
for automatic deploys on every push.

---

## Part 3 — Add to Phone Home Screen

**iPhone/iPad:** Safari → Share → Add to Home Screen
**Android:** Chrome → three-dot menu → Install App

Opens full-screen like a native app. Works offline after first load.

---

## Database Notes

- Supabase free tier: 500MB storage, 2GB/month transfer — plenty for a bank
- All bankers share the same database — any device sees all client records
- Supabase auto-pauses free projects after 1 week idle — just click to unpause
- Daily automatic backups included

---

## Files in This Package

```
fbmt-app/
├── src/
│   ├── App.jsx           The complete balance sheet application
│   └── main.jsx          Entry point with PWA registration
├── public/
│   ├── config.js         YOUR SUPABASE CREDENTIALS GO HERE
│   └── icons/            App icons (add source.png and run generate-icons.js)
├── supabase-schema.sql   Run this in Supabase SQL Editor first
├── index.html            PWA-ready HTML
├── vite.config.js        Build config with PWA plugin
├── package.json          Dependencies
├── netlify.toml          Netlify deploy config
├── generate-icons.js     Icon generator (needs: source.png in public/icons/)
└── README.md             This file
```
"# fbmt-balance-sheet" 
