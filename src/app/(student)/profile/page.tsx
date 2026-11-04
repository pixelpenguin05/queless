'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  ReceiptText, 
  ShieldCheck, 
  LogOut, 
  Clock, 
  MapPin, 
  Database,
  Building,
  ChefHat
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isFirebaseActive, quickLoginAsAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-28">
      
      {/* Header Profile Hero */}
      <div className="bg-gradient-to-r from-[#1A3D4F] via-[#2E5A66] to-[#1D6E72] text-white p-8 md:p-12 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center text-white text-3xl font-heading font-black shadow-inner">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <span className="inline-block bg-[#E8B92C] text-[#1A3D4F] text-xs font-bold font-sans px-3 py-1 rounded-full mb-2 shadow-xs">
              🎓 Chandigarh University Student
            </span>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white tracking-tight">
              {user?.name || 'Campus Student'}
            </h1>
            <p className="text-xs sm:text-sm font-sans text-rose-100 mt-1">
              {user?.phone ? `Mobile: +91 ${user.phone}` : 'Not signed in'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Contact Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft space-y-4">
            <h2 className="eyebrow text-[#8A7F70]">
              Account Details
            </h2>

            <div className="space-y-3 font-sans text-xs sm:text-sm">
              <div className="flex items-center justify-between text-[#5F6B6F] pb-2 border-b border-[#EAE5DC]">
                <span>Name:</span>
                <span className="font-bold text-[#1A3D4F]">{user?.name || 'Not signed in'}</span>
              </div>
              <div className="flex items-center justify-between text-[#5F6B6F] pb-2 border-b border-[#EAE5DC]">
                <span>Mobile Phone:</span>
                <span className="font-bold text-[#1A3D4F]">{user?.phone ? `+91 ${user.phone}` : '—'}</span>
              </div>
              <div className="flex items-center justify-between text-[#5F6B6F]">
                <span>Role:</span>
                <span className="font-bold text-[#1A3D4F] capitalize">{user?.role || 'Guest'}</span>
              </div>
            </div>
          </div>

          {/* Backend & Firebase Status */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft space-y-4">
            <h2 className="eyebrow text-[#8A7F70]">
              System Synchronization
            </h2>

            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isFirebaseActive ? 'bg-[#E7F5EE] text-[#0F5B4C]' : 'bg-[#FBF1D4] text-[#8A6A0B]'
              }`}>
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-heading font-bold text-[#1A3D4F]">
                  {isFirebaseActive ? 'Firebase Cloud Connected' : 'Local Storage Mode Active'}
                </div>
                <p className="text-xs font-sans text-[#5F6B6F] mt-1 leading-relaxed">
                  {isFirebaseActive 
                    ? 'Real-time multi-device Firestore synchronization active.' 
                    : 'Fast in-memory & local fallback mode. Add Firebase keys in .env.local for production sync.'}
                </p>
              </div>
            </div>
          </div>

          {/* Canteen Information */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-soft space-y-3">
            <h2 className="eyebrow text-[#8A7F70]">
              Campus Canteen Information
            </h2>
            <div className="flex items-start gap-3 text-xs sm:text-sm font-sans text-[#5F6B6F]">
              <MapPin className="w-5 h-5 text-[#E23744] flex-shrink-0 mt-0.5" />
              <span>Food Republic C1, Ground Floor, Chandigarh University</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm font-sans text-[#5F6B6F]">
              <Clock className="w-5 h-5 text-[#E8B92C] flex-shrink-0" />
              <span>Operating Hours: Mon – Sat (8:30 AM – 7:30 PM)</span>
            </div>
          </div>

          {/* Restaurant Owner Portal Switch */}
          <div className="bg-gradient-to-r from-[#1A3D4F] to-[#2E5A66] text-white rounded-3xl p-6 shadow-elevated flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="w-5 h-5 text-[#E8B92C]" />
                <h3 className="font-heading font-bold text-lg text-white">Restaurant Owner Portal</h3>
              </div>
              <p className="text-xs font-sans text-white/80 leading-relaxed">
                Add new menu items, update dish prices, manage live inventory and accept kitchen orders.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  quickLoginAsAdmin();
                  router.push('/admin');
                }}
                className="bg-[#E23744] hover:bg-[#CB202D] active:scale-95 text-white font-sans font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md"
              >
                Open Owner Panel →
              </button>
            </div>
          </div>

        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white hover:bg-[#FFF5F5] border border-[#EAE5DC] hover:border-[#CC191D]/30 text-[#CC191D] font-sans font-bold py-4 rounded-2xl shadow-soft flex items-center justify-center gap-2 text-sm transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out Account</span>
        </button>

      </div>
    </div>
  );
}