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
  Sparkles, 
  Database,
  Building,
  Smartphone
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isFirebaseActive, quickLoginAsAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-b from-brand-500 to-amber-600 text-white p-6 rounded-b-4xl shadow-md text-center">
        <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-2xl font-black mx-auto mb-3 shadow-inner">
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>
        <h1 className="text-xl font-black tracking-tight">{user?.name || 'Aman Sharma'}</h1>
        <p className="text-xs text-brand-100 font-medium mt-0.5">
          Roll No: {user?.rollNumber || '21BCS4821'}
        </p>
        <span className="inline-block mt-2 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-[11px] font-bold">
          🎓 Chandigarh University Student
        </span>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {/* Contact Info Card */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Account Details
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-400">Email:</span>
              <span className="font-semibold">{user?.email || 'aman.cu@gmail.com'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-400">Phone:</span>
              <span className="font-semibold">{user?.phone || '+91 98765 43210'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-400">Campus Block:</span>
              <span className="font-semibold">{user?.campusBlock || 'Academic Block B-3'}</span>
            </div>
          </div>
        </div>

        {/* Backend & Firebase Status */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
              isFirebaseActive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {isFirebaseActive ? 'Firebase Cloud Connected' : 'Local Demo Mode Active'}
              </div>
              <p className="text-[10px] text-slate-400">
                {isFirebaseActive ? 'Real-time Firestore DB Sync' : 'Ready for your Firebase credentials in .env.local'}
              </p>
            </div>
          </div>
        </div>

        {/* Canteen Information */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            Campus Canteen Information
          </h2>
          <div className="flex items-start gap-2.5 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <span>Food Republic C1, Ground Floor, Chandigarh University</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-600">
            <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <span>Operating Hours: Monday – Saturday (8:30 AM – 7:30 PM)</span>
          </div>
        </div>

        {/* Kitchen Dashboard Switcher (For quick demonstration) */}
        <div className="bg-slate-900 text-white rounded-3xl p-4 shadow-elevated">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-brand-500 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold">Restaurant Owner Portal</h3>
                <p className="text-[10px] text-slate-400">Register dishes, set prices & manage stock</p>
              </div>
            </div>

            <button
              onClick={() => {
                quickLoginAsAdmin();
                router.push('/admin');
              }}
              className="bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
            >
              Open Panel
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 font-bold py-3.5 rounded-2xl shadow-xs flex items-center justify-center gap-2 text-xs transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out Account</span>
        </button>
      </div>
    </div>
  );
}
