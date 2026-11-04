export type UserRole = 'student' | 'restaurant_owner' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  rollNumber?: string;
  campusBlock?: string;
  restaurantId?: string;
  restaurantName?: string;
}

export type RestaurantStatus = 'pending' | 'approved' | 'rejected';

export interface Restaurant {
  id: string;
  name: string;
  ownerName: string;
  ownerPhone: string;
  counterLocation: string;
  status: RestaurantStatus;
  createdAt: string;
  image?: string;
  description?: string;
}

export type FoodCategory = 'all' | 'meals' | 'snacks' | 'beverages' | 'bakery' | 'combos' | 'south-indian' | 'chinese';

export interface MenuItem {
  id: string;
  restaurantId?: string;
  restaurantName?: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTimeMin: number;
  popular?: boolean;
  rating: number;
  calories?: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customNote?: string;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
}

export type OrderStatus = 
  | 'pending'           // Order placed by student, awaiting canteen acceptance
  | 'accepted'          // Canteen accepted the order
  | 'preparing'         // Kitchen is actively preparing food
  | 'ready'             // Ready at pickup counter
  | 'completed'         // Delivered / Picked up by student
  | 'cancelled';        // Cancelled

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  customNote?: string;
}

export interface Order {
  id: string;
  orderNumber: string;       // e.g. "QL-4821"
  pickupCode: string;        // 4-digit code e.g. "4821"
  studentId: string;
  studentName: string;
  studentPhone: string;
  studentRollNo?: string;
  restaurantId?: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  platformFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  pickupSlot: string;         // e.g. "Immediate (15-20 min)"
  paymentMethod: 'Cash on Delivery' | 'UPI at Pickup';
  paymentStatus: 'Pending' | 'Paid';
  createdAt: string;          // ISO date
  estimatedReadyTime: string; // e.g. "15 mins"
  canteenCounter: string;     // e.g. "Food Republic C1 • Counter 2"
  readyNotificationSent?: boolean;
  completedAt?: string;
}

export interface AppNotification {
  id: string;
  recipientRole: 'student' | 'restaurant_owner' | 'all';
  recipientId?: string; // studentId or restaurantId
  title: string;
  message: string;
  type: 'order_placed' | 'order_accepted' | 'order_preparing' | 'order_ready' | 'order_completed';
  orderId: string;
  orderNumber: string;
  timestamp: string;
  read: boolean;
}
