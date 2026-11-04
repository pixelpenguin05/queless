'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  UtensilsCrossed, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Smartphone,
  Flame,
  ChefHat,
  MapPin,
  Star,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import Image from 'next/image';

export default function WelcomePage() {
  const { user, loading, quickLoginAsStudent, quickLoginAsAdmin } = useAuth();
  const router = useRouter();

  // If user is already authenticated, redirect to appropriate home
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-[#1A3D4F]">
        <div className="w-16 h-16 rounded-3xl bg-[#FFE4E6] border border-[#E23744]/30 flex items-center justify-center animate-bounce shadow-md">
          <UtensilsCrossed className="w-8 h-8 text-[#E23744]" />
        </div>
        <p className="mt-4 font-heading font-bold text-lg text-[#1A3D4F]">Loading QueueLess CU...</p>
        <p className="text-xs font-sans text-[#8A7F70] mt-1">Connecting to Chandigarh University Canteen</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A3D4F] flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Subtle Cream Circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FBF1D4]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#FFE4E6]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 w-full flex-1 flex flex-col justify-center">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand, Headline, Value Prop & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Campus Pill */}
            <div className="inline-flex items-center gap-2 bg-[#E7F5EE] border border-[#0F5B4C]/20 px-3.5 py-1.5 rounded-full text-xs font-sans font-bold text-[#0F5B4C] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Chandigarh University • Food Republic C1 Live</span>
            </div>

            {/* Main Editorial Heading */}
            <div className="space-y-3">
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1A3D4F] tracking-tight leading-[1.15]">
                Skip the Queue. <br />
                <span className="text-[#E23744] italic font-serif">
                  Savor Every Break.
                </span>
              </h1>
              
              <p className="font-sans text-[#5F6B6F] text-base sm:text-lg max-w-xl leading-relaxed pt-1">
                Order your favourite canteen meals right from class. Walk in during lunch break, show your token at <strong>Counter 2</strong>, and pick up fresh hot food instantly.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg">
              <Link
                href="/home"
                className="bg-[#E23744] hover:bg-[#CB202D] active:scale-98 text-white font-sans font-extrabold py-4 px-7 rounded-2xl shadow-elevated flex items-center justify-center gap-3 text-base transition-all group"
              >
                <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
                <span>Enter Canteen & Order Food</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/register"
                className="bg-white hover:bg-[#F5EFE6] text-[#1A3D4F] border border-[#EAE5DC] font-sans font-bold py-4 px-6 rounded-2xl shadow-soft flex items-center justify-center gap-2.5 text-sm transition-all"
              >
                <ChefHat className="w-4 h-4 text-[#E23744]" />
                <span>Restaurant Owner Portal</span>
              </Link>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="pt-4 border-t border-[#EAE5DC] max-w-lg">
              <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#8A7F70] mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#DBA81F]" />
                <span>One-Click Evaluator Demo (No login credentials needed):</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    quickLoginAsStudent();
                    router.push('/home');
                  }}
                  className="bg-white hover:bg-[#FFE4E6]/50 border border-[#EAE5DC] hover:border-[#E23744]/40 p-3 rounded-2xl text-left transition shadow-xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎓</span>
                    <div>
                      <div className="text-xs font-bold font-sans text-[#1A3D4F] group-hover:text-[#E23744]">
                        Student View
                      </div>
                      <div className="text-[10px] font-sans text-[#8A7F70]">
                        Aman Sharma (21BCS4821)
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    quickLoginAsAdmin();
                    router.push('/admin');
                  }}
                  className="bg-white hover:bg-[#FBF1D4]/60 border border-[#EAE5DC] hover:border-[#DBA81F]/50 p-3 rounded-2xl text-left transition shadow-xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">👨‍🍳</span>
                    <div>
                      <div className="text-xs font-bold font-sans text-[#1A3D4F] group-hover:text-[#DBA81F]">
                        Kitchen & Owner Panel
                      </div>
                      <div className="text-[10px] font-sans text-[#8A7F70]">
                        Food Republic C1 Staff
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card (Food & Live Highlights) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md aspect-[4/5] rounded-4xl p-2 bg-gradient-to-b from-white via-white to-[#F5EFE6] border border-[#EAE5DC] shadow-2xl overflow-hidden flex flex-col justify-between">
              
              {/* Background Food Photography */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A3D4F] via-[#1A3D4F]/40 to-transparent" />

              {/* Floating Top Badges */}
              <div className="relative z-10 p-3 sm:p-4 flex justify-between items-center">
                <span className="bg-white/95 backdrop-blur-md border border-[#EAE5DC] text-[#1A3D4F] text-xs font-bold font-sans px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <Flame className="w-4 h-4 text-[#E23744] fill-[#E23744]" />
                  <span>Fresh Canteen Meals</span>
                </span>
                <span className="bg-[#E8B92C] text-[#1A3D4F] text-xs font-black font-sans px-3 py-1.5 rounded-full shadow-md">
                  ₹0 Pre-order Fee
                </span>
              </div>

              {/* Floating Bottom Card: Real-time pickup preview */}
              <div className="relative z-10 p-4">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#E7F5EE] text-[#0F5B4C] flex items-center justify-center font-bold text-xs">
                        <Zap className="w-4 h-4 fill-[#0F5B4C]" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#1A3D4F] font-sans">
                          Counter 2 Express Pickup
                        </div>
                        <div className="text-[10px] text-[#5F6B6F]">
                          Ready in 10-15 minutes
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#E23744] bg-[#FFF5F5] px-2 py-0.5 rounded-lg border border-[#E23744]/20">
                      TOKEN #QL-4821
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-[#EAE5DC] flex items-center justify-between text-[11px] text-[#5F6B6F]">
                    <span>Paneer Butter Masala Thali + Butter Naan</span>
                    <span className="font-bold text-[#1A3D4F]">₹180</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 text-center">
          <div className="bg-white border border-[#EAE5DC] rounded-3xl p-5 shadow-soft hover:shadow-elevated transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FBF1D4] text-[#DBA81F] flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="font-heading font-bold text-[#1A3D4F] text-base">10m Express Prep</div>
            <div className="text-xs font-sans text-[#5F6B6F] mt-1">Pre-ordered during lecture</div>
          </div>

          <div className="bg-white border border-[#EAE5DC] rounded-3xl p-5 shadow-soft hover:shadow-elevated transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE4E6] text-[#E23744] flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="font-heading font-bold text-[#1A3D4F] text-base">Live Token Status</div>
            <div className="text-xs font-sans text-[#5F6B6F] mt-1">Real-time cooking tracker</div>
          </div>

          <div className="bg-white border border-[#EAE5DC] rounded-3xl p-5 shadow-soft hover:shadow-elevated transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F5EE] text-[#0F5B4C] flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="font-heading font-bold text-[#1A3D4F] text-base">Food Republic C1</div>
            <div className="text-xs font-sans text-[#5F6B6F] mt-1">Ground floor express counter</div>
          </div>

          <div className="bg-white border border-[#EAE5DC] rounded-3xl p-5 shadow-soft hover:shadow-elevated transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] text-[#2E5A66] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="font-heading font-bold text-[#1A3D4F] text-base">Pay at Counter</div>
            <div className="text-xs font-sans text-[#5F6B6F] mt-1">UPI QR or cash on pickup</div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-[#EAE5DC] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#8A7F70] gap-3">
          <p>© 2026 QueueLess CU • Chandigarh University Campus Food Ordering System</p>
          <div className="flex items-center gap-4">
            <Link href="/menu" className="hover:text-[#E23744] transition">Canteen Menu</Link>
            <Link href="/admin" className="hover:text-[#E23744] transition">Kitchen Admin</Link>
            <Link href="/login" className="hover:text-[#E23744] transition">Student Sign In</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}