export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNumber?: string;
  phone?: string;
  campusBlock?: string;
}

export type FoodCategory = 'all' | 'meals' | 'snacks' | 'beverages' | 'bakery' | 'combos' | 'south-indian' | 'chinese';

export interface MenuItem {
  id: string;
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
  | 'completed'         // Picked up by student
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
  studentId: string;
  studentName: string;
  studentPhone: string;
  studentRollNo: string;
  items: OrderItem[];
  subtotal: number;
  platformFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  pickupSlot: string;         // e.g. "Break Time (1:15 PM)", "Immediate (15-20 min)"
  paymentMethod: 'Pay at Counter' | 'UPI at Pickup';
  paymentStatus: 'Pending' | 'Paid';
  createdAt: string;          // ISO date
  estimatedReadyTime: string; // e.g. "1:30 PM"
  canteenCounter: string;     // e.g. "Counter 2 (Quick Bites)"
}
