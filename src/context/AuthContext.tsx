'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginAsStudent: (name: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  loginAsOwner: (ownerName: string, phone: string, restaurantName?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsAdmin: () => void;
  updateUserName: (newName: string) => Promise<void>;
  logout: () => Promise<void>;
  quickLoginAsStudent: () => void;
  quickLoginAsAdmin: () => void;
  isFirebaseActive: boolean;
}

const DEMO_STUDENT: UserProfile = {
  id: 'student-demo-1',
  name: 'Aman Sharma',
  phone: '9876543210',
  role: 'student',
  rollNumber: '21BCS4821',
  campusBlock: 'Academic Block B-3',
};

const DEMO_OWNER: UserProfile = {
  id: 'owner-demo-1',
  name: 'Chef Vikram',
  phone: '9811122334',
  role: 'restaurant_owner',
  restaurantId: 'rest-c1',
  restaurantName: 'Food Republic C1',
  campusBlock: 'Food Republic C1 Counter 2',
};

const DEMO_ADMIN: UserProfile = {
  id: 'admin-super-1',
  name: 'CU Campus Director (Admin)',
  phone: '9900011223',
  role: 'admin',
  campusBlock: 'Admin Block 1',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Restore user from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedUser = localStorage.getItem('queueless_cu_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.id === 'student-demo-1' || parsed.id === 'owner-demo-1' || parsed.name === 'Aman Sharma') {
          localStorage.removeItem('queueless_cu_user');
          setUser(null);
        } else {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem('queueless_cu_user');
      }
    }
    setLoading(false);
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Simple student login/signup by Name + Phone
  const loginAsStudent = async (name: string, phone: string): Promise<{ success: boolean; error?: string }> => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim().replace(/\s+/g, '');

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter your name (at least 2 letters).' };
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    const studentProfile: UserProfile = {
      id: 'student-' + cleanPhone.slice(-6),
      name: cleanName,
      phone: cleanPhone,
      role: 'student',
      rollNumber: '21BCS' + cleanPhone.slice(-4),
      campusBlock: 'Food Republic C1',
    };

    setUser(studentProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_user', JSON.stringify(studentProfile));
    }
    setIsAuthModalOpen(false);
    return { success: true };
  };

  // Canteen Owner Login / Registration
  const loginAsOwner = async (ownerName: string, phone: string, restaurantName: string = 'Food Republic C1'): Promise<{ success: boolean; error?: string }> => {
    const cleanName = ownerName.trim();
    const cleanPhone = phone.trim().replace(/\s+/g, '');

    if (!cleanName) {
      return { success: false, error: 'Please enter your name.' };
    }
    if (!cleanPhone) {
      return { success: false, error: 'Please enter your phone number.' };
    }

    const ownerProfile: UserProfile = {
      id: 'owner-' + cleanPhone.slice(-6),
      name: cleanName,
      phone: cleanPhone,
      role: 'restaurant_owner',
      restaurantId: 'rest-c1',
      restaurantName: restaurantName.trim() || 'Food Republic C1',
      campusBlock: restaurantName.trim(),
    };

    setUser(ownerProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_user', JSON.stringify(ownerProfile));
    }
    return { success: true };
  };

  const loginAsAdmin = () => {
    setUser(DEMO_ADMIN);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_user', JSON.stringify(DEMO_ADMIN));
    }
  };

  const updateUserName = async (newName: string) => {
    if (!user) return;
    const updated = { ...user, name: newName };
    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_user', JSON.stringify(updated));
    }
  };

  const logout = async () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('queueless_cu_user');
    }
  };

  const quickLoginAsStudent = () => {
    setUser(DEMO_STUDENT);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_user', JSON.stringify(DEMO_STUDENT));
    }
    setIsAuthModalOpen(false);
  };

  const quickLoginAsAdmin = () => {
    setUser(DEMO_OWNER);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_user', JSON.stringify(DEMO_OWNER));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginAsStudent,
        loginAsOwner,
        loginAsAdmin,
        updateUserName,
        logout,
        quickLoginAsStudent,
        quickLoginAsAdmin,
        isFirebaseActive: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
