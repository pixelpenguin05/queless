'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/lib/types';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    rollNumber?: string,
    phone?: string,
    role?: UserRole,
    restaurantName?: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateUserName: (newName: string) => Promise<void>;
  logout: () => Promise<void>;
  quickLoginAsStudent: () => void;
  quickLoginAsAdmin: () => void;
  isFirebaseActive: boolean;
}

const DEMO_STUDENT: UserProfile = {
  id: 'student-cu-101',
  name: 'Aman Sharma',
  email: 'aman.cu@gmail.com',
  role: 'student',
  rollNumber: '21BCS4821',
  phone: '+91 98765 43210',
  campusBlock: 'Academic Block B-3',
};

const DEMO_ADMIN: UserProfile = {
  id: 'admin-canteen-01',
  name: 'Chef Vikram (Canteen Lead)',
  email: 'admin.canteen@cumail.in',
  role: 'admin',
  rollNumber: 'STAFF-902',
  phone: '+91 98111 22334',
  campusBlock: 'Food Republic C1',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore user from localStorage or Firebase
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              setUser(userDoc.data() as UserProfile);
            } else {
              // Fallback user profile
              const defaultProfile: UserProfile = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Campus Student',
                email: firebaseUser.email || '',
                role: firebaseUser.email?.includes('admin') ? 'admin' : 'student',
                rollNumber: 'CU-2024',
                phone: '+91 98000 00000',
              };
              setUser(defaultProfile);
            }
          } catch (e) {
            console.error('Error fetching Firestore user:', e);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local persistent storage
      const savedUser = localStorage.getItem('queueless_cu_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('queueless_cu_user');
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (isFirebaseConfigured) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          setUser(profile);
          localStorage.setItem('queueless_cu_user', JSON.stringify(profile));
          return { success: true };
        }
      }

      // Local mock login validation
      if (!email.includes('@')) {
        setLoading(false);
        return { success: false, error: 'Please enter a valid campus email address.' };
      }
      if (password.length < 6) {
        setLoading(false);
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }

      const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase().includes('canteen') || email.toLowerCase().includes('owner');
      const profile: UserProfile = isAdmin 
        ? { ...DEMO_ADMIN, email } 
        : {
            id: 'user-' + Date.now(),
            name: email.split('@')[0].toUpperCase(),
            email,
            role: 'student',
            rollNumber: '21BCS' + Math.floor(1000 + Math.random() * 9000),
            phone: '+91 98765 00000',
            campusBlock: 'Block B-3',
          };

      setUser(profile);
      localStorage.setItem('queueless_cu_user', JSON.stringify(profile));
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Login failed. Please check credentials.' };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    rollNumber?: string,
    phone?: string,
    selectedRole?: UserRole,
    restaurantName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (!name.trim()) return { success: false, error: 'Name is required' };
      if (!email.includes('@')) return { success: false, error: 'Valid email is required' };
      if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

      const role: UserRole = selectedRole || (email.toLowerCase().includes('admin') || email.toLowerCase().includes('owner') ? 'admin' : 'student');
      const finalRoll = rollNumber?.trim() || (role === 'admin' ? 'OWNER-' + Math.floor(100 + Math.random() * 900) : '21BCS' + Math.floor(1000 + Math.random() * 9000));
      const finalBlock = role === 'admin' ? (restaurantName?.trim() || 'Food Republic C1') : 'Academic Block B-3';

      if (isFirebaseConfigured) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const profile: UserProfile = {
          id: userCred.user.uid,
          name: name.trim(),
          email: email.trim(),
          role,
          rollNumber: finalRoll,
          phone: phone?.trim() || '+91 98111 22334',
          campusBlock: finalBlock,
        };
        await setDoc(doc(db, 'users', userCred.user.uid), profile);
        setUser(profile);
        localStorage.setItem('queueless_cu_user', JSON.stringify(profile));
        return { success: true };
      }

      // Local persistent registration
      const newProfile: UserProfile = {
        id: (role === 'admin' ? 'owner-' : 'user-') + Date.now(),
        name: name.trim(),
        email: email.trim(),
        role,
        rollNumber: finalRoll,
        phone: phone?.trim() || '+91 98111 22334',
        campusBlock: finalBlock,
      };

      setUser(newProfile);
      localStorage.setItem('queueless_cu_user', JSON.stringify(newProfile));
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const updateUserName = async (newName: string) => {
    if (!user || !newName.trim()) return;
    const updated: UserProfile = { ...user, name: newName.trim() };
    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queueless_cu_user', JSON.stringify(updated));
    }
    if (isFirebaseConfigured && auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), updated, { merge: true });
      } catch (e) {
        console.error('Error updating user in Firestore:', e);
      }
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error('Firebase signout error:', e);
      }
    }
    setUser(null);
    localStorage.removeItem('queueless_cu_user');
  };

  const quickLoginAsStudent = () => {
    setUser(DEMO_STUDENT);
    localStorage.setItem('queueless_cu_user', JSON.stringify(DEMO_STUDENT));
  };

  const quickLoginAsAdmin = () => {
    setUser(DEMO_ADMIN);
    localStorage.setItem('queueless_cu_user', JSON.stringify(DEMO_ADMIN));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateUserName,
        logout,
        quickLoginAsStudent,
        quickLoginAsAdmin,
        isFirebaseActive: isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
