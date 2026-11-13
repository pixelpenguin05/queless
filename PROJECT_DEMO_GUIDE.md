# QueueLess: Live Demo Guide

## 1. The problem and the idea

At a busy canteen or food court, people wait in line to order and then wait again for food, with no idea when it will be ready.

**QueueLess** lets a customer order from their phone. The restaurant accepts the order and promises a ready time, and the customer sees a live countdown. They walk over only when the food is ready.

## 2. How it works

- **Two screens:** `/customer` and `/restaurant`. The landing page `/` lets you pick one.
- **Real-time sync:** every phone subscribes to Cloud Firestore with `onSnapshot`. When one phone writes (a new restaurant, a dish, an order, a status change), Firestore pushes the change to every listening phone within about a second. No refresh or polling is needed.
- **Hosting:** Next.js 14 on Vercel. Vercel serves the pages, and the data lives in Firestore.

```
Customer phone  ──write order──▶  Firestore  ──live push──▶  Restaurant phone
Customer phone  ◀──live push───  Firestore  ◀──accept + time──  Restaurant phone
```

## 3. Live demo (two phones)

Before you start, open the Vercel URL on both phones and turn the volume up. Tap the screen once on each phone; browsers only allow sound after a tap.

| # | Phone A: Restaurant (`/restaurant`) | Phone B: Customer (`/customer`) |
|---|---|---|
| 1 | Register: restaurant name, owner, location, phone | Log in with name + phone. The restaurant already appears in the list. |
| 2 | **Menu** tab: add 3–4 dishes (name, price, veg/non-veg) | Open the restaurant. Dishes appear as they are added. |
| 3 | Mark one dish **Sold out** | That dish greys out instantly |
| 4 | — | Add items, then tap **Place order** |
| 5 | Order pops up under **New orders** with a sound | Shows "Waiting for restaurant…" |
| 6 | Pick **15 min** and tap **Accept** | Live countdown starts: "ready by 3:45 PM" |
| 7 | Tap **+5 min** (optional) | Countdown jumps by 5 minutes |
| 8 | Tap **Mark ready** | Green "Your food is ready! Show code 1234" with a sound |
| 9 | Check the code and tap **Picked up** | Order moves to "Picked up" |

## 4. Likely questions

**Why Firestore instead of your own server?**
Vercel runs code as serverless functions that don't share memory and don't keep connections open. Data kept in server memory would not reach other phones. Firestore is a hosted database with built-in real-time listeners, so every phone gets updates without polling.

**How does the countdown stay correct on both phones?**
When the restaurant accepts, it saves a single timestamp, `readyBy`. Each phone shows `readyBy - now` every second. Nothing is sent per second; only the timestamp is shared.

**How is a wrong pickup prevented?**
Each order gets a 4-digit code. The restaurant hands over the food only when the customer shows that code.

**How do sounds work without audio files?**
The Web Audio API generates two short tones in the browser, and phones that support it also vibrate.

**Is it secure?**
It is a demo: login is just a phone number and the database rules are open. A real version would add phone OTP (Firebase Auth) and rules that only let a restaurant change its own orders.

## 5. Checklist

- [ ] Firebase keys are added in Vercel → Settings → Environment Variables, and the app has been redeployed
- [ ] The yellow "Local mode" banner is **not** showing on the live site
- [ ] Old test data is deleted from the Firebase console, if you want to start clean
- [ ] Both phones are online with volume up, and each screen has been tapped once
