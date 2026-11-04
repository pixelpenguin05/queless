# QueueLess CU — Project Documentation & Live Demo Presentation Guide

> **Project Name**: QueueLess CU — Chandigarh University Smart Canteen Pre-Ordering & Kitchen Sync System  
> **Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Web Audio API, Next.js Serverless API Routes  
> **Design Theme**: Modern Editorial Canteen Theme (Zomato-inspired Crimson `#E23744`, Deep Navy Teal `#1A3D4F`, Warm Cream `#FAF7F2`)  
> **Typography**: Playfair Display (Headings) + Manrope (Body text)  

---

## 1. Executive Summary & Problem Statement

### The Problem
During peak university lecture breaks (11:00 AM, 1:15 PM lunch, 4:30 PM evening), campus food courts like **Food Republic C1** experience massive student congestion:
- Students spend **15–25 minutes standing in line** just to place an order and pay.
- Food preparation adds another 10–15 minutes, causing students to either miss class or skip meals.
- Canteen staff struggle with manual paper tokens, shouted orders, and payment confusion.

### The Solution: QueueLess CU
QueueLess CU is an end-to-end digital pre-ordering and kitchen management web app built for universities:
1. **Zero-friction Student Login**: No complicated passwords; students sign in instantly using their **Full Name** and **10-digit Mobile Number**.
2. **Multi-Canteen Platform**: Any campus canteen or food outlet owner can register their counter.
3. **Super Admin Verification**: Registered canteens must be verified and approved by the Super Admin before their menu goes live.
4. **Token-based Express Pickup & Cash on Delivery (COD)**: Orders generate a unique token (`#QL-XXXX`) and verification pickup code.
5. **Real-time Two-Device Synchronization**: Kitchen gets audio chimes and banners the moment an order is placed; students get sound alerts the second their food is marked "Ready for Pickup".

---

## 2. System Architecture & Route Directory

```
queless/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing / Welcome Page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx          # Fast Student Sign In (Name & Phone)
│   │   │   └── register/page.tsx       # Canteen / Outlet Self-Registration
│   │   ├── (admin)/
│   │   │   └── admin/page.tsx          # Kitchen Order Board + Canteen Approvals + Menu Setup
│   │   ├── (student)/
│   │   │   ├── home/page.tsx           # Student Browse Canteens & Dishes
│   │   │   ├── menu/page.tsx           # Full Filterable Canteen Menu
│   │   │   ├── cart/page.tsx           # Tray / Cart Review
│   │   │   ├── checkout/page.tsx       # COD Order Confirmation & Token Issuance
│   │   │   ├── orders/page.tsx         # Active & Past Orders List
│   │   │   ├── orders/[id]/page.tsx    # Live Token Screen & Kitchen Cooking Tracker
│   │   │   └── profile/page.tsx        # Student Account Info
│   │   └── api/
│   │       ├── orders/route.ts         # GET/POST/PATCH Orders & Token generator
│   │       ├── restaurants/route.ts    # GET/POST/PATCH Canteen registration & approval
│   │       ├── menu/route.ts           # GET/POST/PATCH/DELETE Menu dishes & live stock
│   │       ├── notifications/route.ts  # Role-based notification polling (student / owner)
│   │       └── reset/route.ts          # Instant store reset to 0 for demo evaluations
│   ├── components/
│   │   ├── Navbar.tsx                  # Fully responsive top navigation (mobile drawer + desktop)
│   │   ├── BottomNav.tsx               # Mobile app bottom navigation bar
│   │   ├── StudentAuthModal.tsx        # 2-field fast onboarding modal (Name + Phone)
│   │   ├── NotificationBanner.tsx      # Real-time floating alert banner with Web Audio chime
│   │   ├── FoodCard.tsx                # Responsive food card with veg/non-veg tag & quick add
│   │   ├── FoodDetailModal.tsx         # Dish customization modal (custom notes)
│   │   ├── LiveOrderTracker.tsx        # 4-stage cooking progress pipeline
│   │   └── OrderStatusBadge.tsx        # Status pill badge
│   ├── context/
│   │   ├── AuthContext.tsx             # Student, Owner, and Admin auth state
│   │   ├── CartContext.tsx             # Tray calculations & item quantity
│   │   ├── MenuContext.tsx             # Live menu state & category filters
│   │   └── OrderContext.tsx            # Order placement & 2.5s cross-device polling
│   └── lib/
│       ├── serverStore.ts              # Global in-memory server store for cross-device sync
│       ├── sound.ts                    # Web Audio API synthesized chimes (zero external files)
│       └── types.ts                    # TypeScript definitions
```

---

## 3. Teacher Presentation Script: Step-by-Step Live Demo

When presenting to your teacher, follow these **8 structured stages**.

### Stage 0: Verify Clean State (Show Teacher Everything Starts at Zero)
- **Teacher Explanation**: *"Sir/Ma'am, to prove that our application is truly dynamic and not relying on static hardcoded mock data, notice that we are starting with 0 canteens, 0 dishes, and 0 orders."*
- **Action**: Open `https://<your-url>/api/reset` in a browser tab.
- **Result**: Confirms:
  ```json
  {
    "success": true,
    "message": "All system data has been completely wiped to 0."
  }
  ```

---

### Stage 1: Canteen / Restaurant Registration
- **Teacher Explanation**: *"In Chandigarh University, different canteens like Food Republic, Nescafe, and South Indian counter operate under different vendors. Step 1 is allowing any canteen owner to register their counter onto QueueLess."*
- **Action**:
  1. Navigate to `/register`.
  2. Enter:
     - **Restaurant / Canteen Name**: `Nescafe Hub C1`
     - **Owner Name**: `Chef Vikram`
     - **Contact Phone**: `9811122334`
     - **Counter Location**: `Block B-3 • Ground Floor Counter 2`
     - **Description**: `Hot brews, frappes, grilled subs, and rolls.`
  3. Click **"Register Canteen & Open Portal"**.
- **Result**: Canteen application is submitted. It is placed in `⏳ Pending Approval` status.

---

### Stage 2: Super Admin Verification & Menu Creation
- **Teacher Explanation**: *"To ensure hygiene and university campus authorization, a vendor cannot sell to students until the Super Admin verifies and accepts them."*
- **Action**:
  1. Open `/admin`.
  2. Click on the **"Canteen Verifications"** tab.
  3. Show the teacher `Nescafe Hub C1` waiting in the pending queue.
  4. Click **"Approve & Verify"**.
  5. The badge immediately turns green (`✓ Verified & Active`).
  6. Switch to the **"Food Items"** tab, click **"Add Food Dish"**, and add 2 dishes:
     - Dish 1: `Cold Coffee Frappe` | `₹60` | Category: `Chai & Shakes`
     - Dish 2: `Crispy Herb Burger` | `₹75` | Category: `Snacks & Bites`
- **Result**: The canteen and its dishes are now live on the student portal.

---

### Stage 3: Student Simplified Onboarding
- **Teacher Explanation**: *"Most apps force students to verify complex passwords or OTPs, which causes abandonment. We simplified onboarding to a 2-field modal: Full Name and 10-Digit Mobile Number."*
- **Action** (On Phone 1 or second browser):
  1. Open `/home`.
  2. Notice `Nescafe Hub C1` is now visible under *Registered Campus Canteens*.
  3. Click **"Sign In"** in the navbar.
  4. Enter Name: `Aman Sharma`, Phone: `9876543210`.
  5. Tap **"Start Ordering Campus Food"**.
- **Result**: Student is instantly signed in. Their mobile number is linked to their profile and future orders.

---

### Stage 4: Order Placement & Token Generation (Cash on Delivery)
- **Teacher Explanation**: *"Students add items to their tray and select Cash on Delivery. A live token is generated with a 4-digit verification code so students don't need to crowd the counter until food is ready."*
- **Action**:
  1. Click **+ Add** on `Cold Coffee Frappe` and `Crispy Herb Burger`.
  2. Click **"View Tray"** (`/cart`). Total is `₹135`.
  3. Proceed to `/checkout`.
  4. Select **Pickup Slot**: `Immediate (15-20 min)`.
  5. Payment method defaults to **Cash on Delivery (Pay at Counter)**.
  6. Click **"Place Canteen Pre-Order"**.
- **Result**: Screen redirects to `/orders/[id]` displaying:
  - **Token `#QL-XXXX`**
  - **4-Digit Verification Code**
  - Pickup Location: `Block B-3 • Ground Floor Counter 2`
  - Status: `Pending Acceptance`

---

### Stage 5: Kitchen Receives Order in Real-Time (Two-Phone Demonstration)
- **Teacher Explanation**: *"Now look at Phone 2 (Kitchen Admin). Without refreshing the page, the order arrives automatically within 2.5 seconds with an audible chime and banner."*
- **Action**:
  - Show Phone 2 running `/admin`.
  - Hear the **Audio Chime 🔔**.
  - Point to the notification banner: *"New Order #QL-XXXX from Aman Sharma (+91 9876543210) • ₹135 COD"*.
  - Show the order card with customer details, phone number, and items.

---

### Stage 6: Chef Starts Preparing Food
- **Teacher Explanation**: *"When the chef starts cooking, the student's phone updates live so they know food is in the kitchen."*
- **Action**:
  1. On Phone 2, click **"1. Accept Order"**, then **"2. Start Preparing Food"**.
  2. Look at Phone 1 (Student screen).
- **Result**: The student's screen transitions to **"CHEF IS ACTIVELY PREPARING YOUR FOOD"** with an active cooking animation.

---

### Stage 7: Food Done Notification & Sound Trigger
- **Teacher Explanation**: *"When the chef finishes packing the meal, they tap 'Food Done'. The student's phone chimes and alerts them to walk to the counter."*
- **Action**:
  1. On Phone 2, click **"3. Food Done! Send 'Ready for Pickup' Notification"**.
  2. Look at Phone 1.
- **Result**:
  - Phone 1 plays an audio chime 🔔.
  - The card turns emerald green with gold border.
  - Heading flashes: **"YOUR FOOD IS READY! PLEASE COLLECT AT COUNTER"**.

---

### Stage 8: Physical Counter Handover & Payment Collection
- **Teacher Explanation**: *"The student walks up to Counter 2, shows their Token # and Code, pays ₹135 cash, and receives the meal."*
- **Action**:
  1. On Phone 2, click **"4. Hand Over to Student (Collect Cash / Complete Order)"**.
  2. Order moves from Active to Completed.
  3. The daily revenue on `/admin` increments by `₹135`.
- **Result**: Order lifecycle is 100% complete.

---

## 4. Key Questions & Viva Defense Guide

### Q1: Why did you choose Next.js 14 App Router?
> **Answer**: *"Next.js 14 App Router offers server-side rendering for lightning-fast first paint, built-in serverless API routes (`/api/orders`, `/api/restaurants`), and layout nesting. This allowed us to keep the backend API and frontend in a single cohesive full-stack architecture without needing a separate Express server."*

### Q2: How does real-time communication work without Firebase or Socket.IO?
> **Answer**: *"We implemented high-efficiency lightweight HTTP polling (2.5-second interval) paired with Next.js serverless route handlers and a server-side in-memory shared store (`serverStore.ts`). This allows seamless cross-device communication across any network (cellular data, university Wi-Fi) without WebSocket firewall blocks or third-party database costs."*

### Q3: How do the audio notifications work on mobile browsers without downloading MP3s?
> **Answer**: *"We utilized the browser's native **Web Audio API** (`sound.ts`) using an AudioContext oscillator synthesizer. It synthesizes custom chime frequencies (880Hz → 1320Hz) client-side. This ensures zero network latency, no external asset dependency, and full compatibility across iOS Safari, Android Chrome, and desktop browsers."*

### Q4: How does the system handle multi-tenancy for multiple canteens?
> **Answer**: *"Each registered canteen has a unique ID (`rest-XXXX`). Dishes and orders carry `restaurantId` references. In the student UI, students can filter dishes by specific canteen counters or view all counters at once. The Kitchen Portal automatically isolates incoming orders and dishes by canteen."*

### Q5: How do you prevent fraudulent or uncollected Cash on Delivery orders?
> **Answer**: *"Every order requires a verified student mobile number and generates both a public Token # and a private 4-digit verification code. The kitchen only hands over food when the token and code match on the student's screen, and orders are tied to the student's phone number on the admin dashboard."*

---

## 5. Summary Checklist for Presentation Day

- [x] Clear data before presenting using `/api/reset`.
- [x] Device 1 (Student): Open `https://<your-project>.vercel.app/home`.
- [x] Device 2 (Canteen/Admin): Open `https://<your-project>.vercel.app/admin`.
- [x] Ensure volume is turned up on both devices to demonstrate the **Web Audio Chimes**.
- [x] Walk through the 8 stages in order: Registration → Verification → Dish Adding → Student Sign In → COD Order → Kitchen Reception → Cooking → Pickup Handover.
