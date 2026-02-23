# ☕ Cup of Tea Penpal

> In a fast world, slow down. One new friend, every week.

Like meeting someone at a guesthouse, sharing a meal, and talking through the night. No pressure. Just good conversation.

## What is this?

A mobile penpal app that matches you with **one person from another country, every Monday**. Text-only. Opposite gender. Based on shared interests.

The match lasts one week. No swiping, no endless scrolling — just a cup of tea and a conversation.

## Features

- 📅 **Weekly matching** — Every Monday, you get one new penpal
- 🌍 **Global** — People from 100+ countries
- ❤️ **Opposite gender** matching
- 🎯 **Interest-based** — Matched by shared hobbies
- 💬 **Text-only chat** — Focused conversation, no distractions
- 🔔 **Push notifications** when your penpal messages you
- ⏳ **Countdown timer** to your next match

## Tech Stack

- **Mobile**: Expo SDK 54 + React Native + expo-router
- **Backend**: Firebase (Firestore + Auth + Cloud Functions + FCM)
- **Matching**: Cloud Functions cron every Monday 00:00 UTC

## Project Structure

```
├── mobile/          # Expo React Native app
│   ├── app/         # expo-router screens
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom React hooks
│   ├── services/    # Firebase service layer
│   ├── constants/   # Colors, countries, interests
│   └── types/       # TypeScript interfaces
│
└── firebase/        # Firebase project
    ├── functions/   # Cloud Functions (matching cron + FCM)
    ├── firestore.rules
    └── firestore.indexes.json
```

## Setup

### 1. Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Create **Firestore** database
4. Copy your Firebase config

### 2. Mobile App

```bash
cd mobile
cp .env.example .env
# Fill in your Firebase config in .env
npm install
npx expo start
```

### 3. Cloud Functions

```bash
cd firebase
npm install -g firebase-tools
firebase login
firebase use --add  # select your project
cd functions
npm install
npm run build
firebase deploy --only functions
```

## Design

Dark cabin at night. Campfire warmth. Backpacker hostel lounge.

- Background: `#1A0F07` (dark espresso wood)
- Primary: `#E8943A` (warm amber / fire)
- Accent: `#C8A86B` (candlelight gold)

## Matching Algorithm

1. Find all users with `isAvailableForMatching = true` and no current match
2. Filter: opposite gender only
3. Score by shared interests (+ bonus for different countries)
4. Greedy match by score (highest interest overlap first)
5. Send FCM push notification to both users

## License

MIT
