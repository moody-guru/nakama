This is your Master Plan for "Nakama". It is designed to be your Single Source of Truth. Save this as DESIGN_DOC.md in your project root.
It covers the Tech Stack, Architecture, Data Model, Step-by-Step Execution, and Deployment Strategy.

📜 Project Nakama: Master Design Document
Goal: A gamified marketplace for anime collectors to trade items and bounties using "Otaku Coin" (OTC).
Target Launch: MVP in 2 weeks.

1. 🛠 The "Speedrun" Tech Stack (2025 Standard)
This stack is chosen for maximum speed and compatibility.
Component	Technology	Why?
Core	React Native (Expo SDK 52+)	No native code management. Fastest setup.
Routing	Expo Router v4	File-based routing (like Next.js) is the modern standard.
UI System	Tamagui or Gluestack	Copy-paste components that look good instantly.
Lists	@shopify/flash-list	Mandatory for image-heavy masonry feeds.
Backend	Firebase	Auth, Firestore (DB), Storage (Images), Functions.
Forms	React Hook Form + Zod	Simple validation for "Create Listing" forms.
Deployment	EAS (Expo Application Services)	One-command deploy to Apple & Google stores.

2. 📂 Project Architecture
We will use a src/ folder to keep the root clean.
Plaintext

/nakama
├── /app                    # EXPO ROUTER (Navigation)
│   ├── _layout.tsx         # Providers (Auth, Theme, Toasts)
│   ├── index.tsx           # Login Screen
│   ├── (tabs)              # Main Tab Bar
│   │   ├── _layout.tsx
│   │   ├── feed.tsx        # "Surfing" (Shop)
│   │   ├── wanted.tsx      # "Bounties" (Wanted Board)
│   │   └── profile.tsx     # User Stats & Inventory
│   ├── listing
│   │   └── [id].tsx        # Dynamic Route: Item Details + Comments
│   └── post                # "Create" Modal
│       └── index.tsx
├── /src
│   ├── /components         # UI Building Blocks (Buttons, Cards)
│   ├── /features           # Complex Domain Logic
│   │   ├── /auth           # Login/Signup Forms
│   │   ├── /market         # Feed Logic & Filtering
│   │   └── /wallet         # Coin Logic
│   ├── /services           # API Wrappers
│   │   ├── firestore.ts    # Database calls
│   │   ├── storage.ts      # Image Upload logic
│   │   └── trade.ts        # The "Atomic" Transaction function
│   ├── /types              # TypeScript Definitions
│   └── /utils              # Helpers (Currency formatter, Date parser)
├── firebaseConfig.ts
└── app.json


3. 💾 The Database Schema (Firestore)
Collection: users
The User Profile & Wallet.
TypeScript

{
  uid: string;
  displayName: string;
  bio: string; // e.g., "Gundam Builder"
  avatarUrl: string;
  walletBalance: number; // The "Liquid" Cash
  netWorth: number; // Balance + Value of Inventory
  reputation: number; // 0-5 stars
  wins: number; // Weekly Leaderboard wins
}
Collection: listings
Items for Sale AND Wanted Bounties.
TypeScript

{
  id: string;
  type: 'SELL' | 'WANTED'; // <--- The Switch
  title: string;
  price: number; // OTC Coins
  images: string[]; // Array of Storage URLs
  sellerId: string;
  status: 'ACTIVE' | 'SOLD' | 'FULFILLED' | 'ARCHIVED';
  tags: string[]; // ['OnePiece', 'Figure', 'Rare']
  isBoosted: boolean; // Did they pay 5 coins to feature this?
  createdAt: timestamp;
}
Sub-Collection: listings/{id}/comments
Negotiation threads.
TypeScript

{
  id: string;
  text: string; // "Will you accept 40 coins?"
  authorId: string;
  createdAt: timestamp;
}
Collection: ledger (CRITICAL)
The unchangeable history of all money movement.
TypeScript

{
  txId: string;
  fromUser: string;
  toUser: string;
  amount: number;
  reason: 'TRADE' | 'BOOST' | 'AIRDROP' | 'WEEKLY_PRIZE';
  listingId?: string; // Optional (if trade)
  timestamp: timestamp;
}

4. 🚀 Execution Plan (Step-by-Step)
Phase 1: Identity & Wallet (Days 1-3)
    • Goal: User can Login, see their Avatar, and see "100 OTC" in their wallet.
    • Tasks:
        1. Setup Firebase Auth (Email/Pass).
        2. Create onCreateUser trigger: Give 100 OTC automatically.
        3. Build ProfileScreen: Show Avatar, Bio, and specific "Coin Card" component.
Phase 2: The "Surfing" Feed (Days 4-6)
    • Goal: User can upload an item and see it in a Masonry Grid.
    • Tasks:
        1. Build PostScreen: Input Title, Price, Type (Sell/Wanted).
        2. Implement expo-image-picker -> Upload to Firebase Storage.
        3. Build FeedScreen: Use FlashList to display items in 2 columns.
        4. Add "Boost" logic: Deduct 5 coins to make the border glow gold.
Phase 3: The Economy (Days 7-9)
    • Goal: User A buys item from User B. Money moves, Item moves.
    • Tasks:
        1. Implement listing/[id].tsx (Detail View).
        2. Write the Transaction Function (The "Buy Now" button).
        3. TEST: Try to buy with 0 coins (Must fail). Try to buy with 200 coins (Must work).
Phase 4: Social & Polish (Days 10-14)
    • Goal: Comments and Leaderboard.
    • Tasks:
        1. Add Comments section to Detail View.
        2. Create LeaderboardScreen (Sort users by netWorth).
        3. Add "Edit Profile" to change Avatar/Bio.

5. 🚢 Deployment Strategy (The "Go Live")
We will use EAS (Expo Application Services). It is the only sane way to deploy React Native in 2025.
Step 1: Pre-Production
    1. Icons: Create a 1024x1024 icon and run npx expo-image-utils to generate assets.
    2. Config: Update app.json with a unique bundle ID (e.g., com.yourname.nakama).
Step 2: The Build (Cloud)
You do not need a Mac. Expo builds it in the cloud.
Bash

# Install EAS CLI
npm install -g eas-cli
# Login
eas login
# Build for Android & iOS
eas build --profile production
Step 3: The Submit (Automated)
Bash

eas submit --platform all
    • Google Play: You will need a $25 developer account. You must upload the first build manually via the dashboard, then EAS works forever.
    • App Store: You will need a $99/year Apple Developer account. EAS handles the certificates automatically.

👉 Next Immediate Action
You have the plan. Now we code.
Do this now:
    1. Run the terminal commands I gave you earlier to create the app.
    2. Reply "Ready" and I will give you the Code for services/auth.ts and app/_layout.tsx so you can tick off "Phase 1" today.
Relevant Video: React Native File Structure Explained Best Practices & Tips 2025
This video will help you visualize the app vs src folder structure we are using.
