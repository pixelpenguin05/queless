# QueueLess

Order ahead, skip the queue. A small demo app with two screens:

| Screen | URL | What it does |
| --- | --- | --- |
| Customer | `/customer` | Log in with name + phone, pick a restaurant, order, watch a live countdown until the food is ready |
| Restaurant | `/restaurant` | Register (or log in by phone), add a menu, accept orders with a prep time, mark ready, mark picked up |

Everything updates live across devices through **Cloud Firestore** real-time listeners.

## Project structure

```
src/
  app/
    page.tsx              Landing: choose Customer or Restaurant
    customer/page.tsx     Customer screen
    restaurant/page.tsx   Restaurant screen
  components/
    ui.tsx                Buttons, inputs, cards, tabs, badges
    order.tsx             Live countdown + order item list
  lib/
    db.ts                 All data reads/writes + live subscriptions
    firebase.ts           Firebase setup
    hooks.ts              useLive, useStoredState, useNow
    alert.ts              Sound + vibration on new order / status change
    types.ts              Restaurant, MenuItem, Order
```

## Order lifecycle

```
pending ──accept (10/15/20/30 min)──▶ accepted ──▶ ready ──▶ completed
   │                                     (+5 min to extend)
   ├──reject──▶ rejected
   └──customer cancels──▶ cancelled
```

When the restaurant accepts, it stores `readyBy` (a timestamp). The customer's phone counts down to it.

## Setup

> The app is already connected to the Firebase project `queless-54892` (config in [`src/lib/firebase.ts`](src/lib/firebase.ts)), so steps 1–3 are only needed if you move to a different Firebase project.

### 1. Create a Firebase project (free)

1. Go to <https://console.firebase.google.com> and click **Add project**.
2. **Build → Firestore Database → Create database**. Pick a nearby location and start in **production mode**.
3. Open the **Rules** tab, paste the contents of [`firestore.rules`](firestore.rules), and click **Publish**.
4. **Project settings (gear icon) → Your apps → Web (`</>`)**. Register an app and copy the config values.

### 2. Run locally

```bash
cp .env.local.example .env.local   # then fill in the Firebase values
npm install
npm run dev
```

Without Firebase keys the app still runs in **local mode**. Data is saved in one browser and syncs between its tabs, which is handy for a quick try but won't sync between phones.

### 3. Deploy to Vercel

1. Push to GitHub and import the repo in Vercel.
2. **Settings → Environment Variables**: add all six `NEXT_PUBLIC_FIREBASE_*` values.
3. Deploy (or **Redeploy** if you added the variables after the first deploy).

## Demo-only notes

- Login is just a phone number, with no OTP or password, and the Firestore rules are open. That is fine for a demo but not for real customers.
- To reset demo data, delete the `restaurants`, `menuItems` and `orders` collections in the Firebase console.
