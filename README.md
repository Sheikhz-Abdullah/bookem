# Bookem — Setup Guide

## What this is
A full SaaS booking platform for cafes and restaurants in the UAE.
Any cafe can sign up at bookem.ae/signup and get their own booking page at bookem.ae/cafename.

---

## Step 1 — Set up Supabase (your database)

1. Go to supabase.com and create a free account
2. Click "New project" → name it "bookem" → choose region: Middle East (Bahrain)
3. Wait ~2 minutes for it to set up
4. Go to SQL Editor → paste the contents of `supabase-schema.sql` → click Run
5. Go to Settings → API → copy:
   - Project URL (looks like https://xxxx.supabase.co)
   - Anon public key (starts with eyJ...)

---

## Step 2 — Push to GitHub

1. Go to github.com → New repository → name it "bookem" → Public → Create
2. Upload all these files to the repository (drag and drop)

---

## Step 3 — Deploy to Vercel

1. Go to vercel.com → Add New Project → Import your "bookem" GitHub repo
2. Under Environment Variables, add:
   - VITE_SUPABASE_URL = your Supabase project URL
   - VITE_SUPABASE_KEY = your Supabase anon key
3. Click Deploy
4. Your app is live at bookem.vercel.app (or your custom domain)

---

## How it works

- bookem.ae/ → Landing page
- bookem.ae/signup → Cafe registers (creates account + cafe profile)
- bookem.ae/login → Cafe owner logs in
- bookem.ae/dashboard → Owner manages bookings, menu, hours, settings
- bookem.ae/sandsbistro → Customer booking page for that cafe

---

## Adding your first cafe manually (for demos)

1. Go to your live site → /signup
2. Fill in the cafe details
3. Their page is instantly live at /yourcafeslug

---

## File structure

```
bookem/
├── index.html
├── vite.config.js
├── package.json
├── vercel.json
├── supabase-schema.sql
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── AuthContext.jsx
    ├── index.css
    ├── supabase.js
    ├── components/
    │   └── Navbar.jsx
    └── pages/
        ├── Landing.jsx
        ├── Signup.jsx
        ├── Login.jsx
        ├── Dashboard.jsx
        └── CafePage.jsx
```
