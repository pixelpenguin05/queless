# 🍽️ QueueLess CU — Campus Canteen Food Ordering System

> **"Skip the Queue. Enjoy Your Break."**  
> A production-grade mobile-first Progressive Web App (PWA) built specifically for college students and canteen staff at **Chandigarh University (CU)**.

---

## 🌟 1. Project Overview & Features

### 🎓 Student Experience
- **Welcome & Onboarding:** Sleek startup-grade hero landing page with quick demo accounts for immediate review.
- **Authentication:** Registration with CU Roll Number, Name, Email, and Phone. Secure login with Firebase Authentication + persistent session storage.
- **Student Home (`/home`):**
  - Live Active Order status tracker pill.
  - Category selector (Thalis, Combos, Snacks, South Indian, Chinese, Beverages, Bakery).
  - "Trending on CU Campus" recommendations.
  - Smart lunch rush announcement & campus break shortcuts.
- **Interactive Menu (`/menu`):**
  - Instant live keyword search.
  - "Pure Veg 🌱" toggle filter.
  - Dietary labels, spice preferences, calorie counters, and prep times.
  - Sold Out / Out-of-stock real-time states.
- **Tray & Cart (`/cart`):**
  - Stepper quantity modifier (`- 1 +`).
  - Item-specific notes (e.g., "extra chutney", "less spicy").
  - Transparent bill breakdown: Subtotal, Campus Canteen Packaging (₹2), and Govt GST (5%).
- **Checkout & Pre-Order (`/checkout`):**
  - Campus break slot selection: *Immediate (15-20 min)*, *Morning Break (11:00 AM)*, *Lunch Break (1:15 PM)*, *Evening Snacks (4:30 PM)*.
  - Pickup Counter assignment (Counter 2 Express Lane, Academic Block B-3).
  - Clear payment transparency: Pay at Counter via UPI QR or Cash.
- **Live Order Tracking (`/orders/[id]`):**
  - Big Pickup Token code display (e.g., `#QL-4821`).
  - Real-time 4-step preparation tracker: `Order Sent` ➔ `Accepted` ➔ `Preparing` ➔ `Ready for Pickup!`.
  - Built-in simulator button to advance status for live testing.

---

### 👨‍🍳 Canteen Kitchen Staff & Admin Experience (`/admin`)
- **Access Control:** Restricted to canteen staff accounts (`role: 'admin'`). Ordinary students cannot view kitchen controls.
- **Live Kitchen Queue:**
  - Real-time incoming orders with student roll number, pickup time slot, and special notes.
  - One-click workflow triggers: `Accept Order` ➔ `Start Cooking` ➔ `Mark Ready for Pickup` ➔ `Handed Over`.
  - Live kitchen metrics: Pending count, Cooking count, Ready count, and Today's Gross Revenue.
- **Menu Management Dashboard:**
  - Add new dishes with price, prep time, category, and veg/non-veg status.
  - Instant One-Tap Out-of-Stock / In-Stock toggle (`Sold Out`).
  - Delete or reset menu items to sample data.

---

## 🚀 2. Quick Start Guide

### Step 1: Install Dependencies (Already Completed)
Node v24 and pnpm are configured. If you ever need to re-install:
```bash
pnpm install
```

### Step 2: Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 3. How to Test as an App on Android or iPhone (PWA)

1. Make sure your computer and phone are connected to the same Wi-Fi network.
2. In your terminal, run:
   ```bash
   pnpm dev -- -H 0.0.0.0
   ```
3. Look up your computer's local IP address (e.g. `192.168.1.15`).
4. On your phone's browser (Chrome on Android or Safari on iOS), open:
   ```
   http://192.168.1.15:3000
   ```
5. **Install on Phone:**
   - **Android Chrome:** Tap the 3 dots in the top right ➔ Tap **"Add to Home Screen"** or **"Install App"**.
   - **iPhone Safari:** Tap the Share button (square with arrow) ➔ Tap **"Add to Home Screen"**.
6. The **QueueLess CU** app icon will appear directly on your phone's home screen and open full-screen like a native mobile app!

---

## ⚡ 4. Fast One-Click Demo Credentials

You do not need to register or type passwords to evaluate the app. Use the built-in quick login buttons on the Welcome/Login screens:

| Role | Name | Email | Features |
| :--- | :--- | :--- | :--- |
| **Student** | Aman Sharma (`21BCS4821`) | `aman.cu@gmail.com` | Browse menu, customize food, place pre-order, track pickup token |
| **Kitchen Staff** | Chef Vikram (Block 3 Lead) | `admin.canteen@cumail.in` | Live kitchen order queue, status transitions, menu stock toggles |

---

## 🔥 5. Firebase Setup (Authentication & Cloud Firestore)

The app works out of the box with realistic mock data and localStorage synchronization. To connect your live Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project (e.g. `queueless-cu`).
2. Go to **Authentication** ➔ Enable **Email/Password** sign-in provider.
3. Go to **Firestore Database** ➔ Create a database in production mode.
4. Go to **Project Settings** (gear icon) ➔ **General** ➔ Under **Your apps**, click the Web icon `</>` to register a web app.
5. Copy the configuration keys and create `.env.local` in this project:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

6. Copy the provided [firestore.rules](file:///c:/Users/muska/Desktop/queless/firestore.rules) into the **Firestore Database > Rules** tab in your Firebase Console and click **Publish**.

---

## 🔒 6. Security & Data Integrity

- **Role-based Security:** Enforced by Firestore Security Rules (`isAdmin()` check on the user document in `/users/{userId}`).
- **Data Validation:** Order amounts are strictly validated against non-negative item quantities and prices.
- **Client Security:** Private service account keys are never exposed in the front-end code.
