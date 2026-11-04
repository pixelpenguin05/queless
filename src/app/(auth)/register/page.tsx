'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  ChefHat, 
  Store, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { loginAsOwner, openAuthModal } = useAuth();

  const [restaurantName, setRestaurantName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [counterLocation, setCounterLocation] = useState('');
  const [description, setDescription] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!restaurantName.trim()) {
      setError('Please provide your Canteen or Restaurant name.');
      return;
    }
    if (!ownerName.trim()) {
      setError('Please enter the Owner / Manager name.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: restaurantName.trim(),
          ownerName: ownerName.trim(),
          ownerPhone: cleanPhone,
          counterLocation: counterLocation.trim() || 'Campus Canteen Counter',
          description: description.trim() || 'Fresh campus food outlet',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to register restaurant.');
      }

      // Log in as this owner in AuthContext
      await loginAsOwner(ownerName.trim(), cleanPhone, restaurantName.trim());
      setSuccess(true);

      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full mx-auto bg-white rounded-4xl p-8 sm:p-10 border border-[#EAE5DC] shadow-soft">
        
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1A3D4F] to-[#2E5A66] flex items-center justify-center text-[#E8B92C] shadow-md mb-6">
          <ChefHat className="w-8 h-8 stroke-[2.3]" />
        </div>

        <h1 className="font-heading font-extrabold text-3xl text-[#1A3D4F] tracking-tight">
          Register Canteen / <br />
          <span className="text-[#E23744]">Food Outlet</span>
        </h1>
        <p className="font-sans text-sm text-[#5F6B6F] mt-1.5 leading-relaxed">
          Join Chandigarh University campus network. Receive student orders, manage menu dishes, and issue express pickup tokens.
        </p>

        {/* Success Alert */}
        {success && (
          <div className="mt-4 bg-[#E7F5EE] border border-[#0F5B4C]/30 text-[#0F5B4C] px-4 py-3 rounded-2xl text-xs font-sans flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <div>
              <strong>Application Submitted!</strong> Redirecting to your Kitchen Portal. Super Admin will verify your listing.
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-4 bg-[#FFF5F5] border border-[#CC191D]/30 text-[#CC191D] px-4 py-3 rounded-2xl text-xs font-sans flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#8A7F70] uppercase tracking-wider block mb-1.5">
              Restaurant / Canteen Name
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-[#8A7F70] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Food Republic C1 / Nescafe Corner"
                className="w-full bg-[#FAF7F2] border border-[#EAE5DC] text-[#1A3D4F] rounded-2xl pl-11 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#1A3D4F] shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#8A7F70] uppercase tracking-wider block mb-1.5">
                Owner / Manager Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A7F70] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Chef Vikram"
                  className="w-full bg-[#FAF7F2] border border-[#EAE5DC] text-[#1A3D4F] rounded-2xl pl-11 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#1A3D4F] shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#8A7F70] uppercase tracking-wider block mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8A7F70] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98111 22334"
                  className="w-full bg-[#FAF7F2] border border-[#EAE5DC] text-[#1A3D4F] rounded-2xl pl-11 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#1A3D4F] shadow-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#8A7F70] uppercase tracking-wider block mb-1.5">
              Pickup Counter Location in Campus
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8A7F70] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={counterLocation}
                onChange={(e) => setCounterLocation(e.target.value)}
                placeholder="e.g. Academic Block B-3 • Ground Floor Counter 2"
                className="w-full bg-[#FAF7F2] border border-[#EAE5DC] text-[#1A3D4F] rounded-2xl pl-11 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#1A3D4F] shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#8A7F70] uppercase tracking-wider block mb-1.5">
              Short Description / Cuisine Speciality
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-[#8A7F70] absolute left-4 top-3" />
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. North Indian meals, fast food combos, and fresh beverages."
                className="w-full bg-[#FAF7F2] border border-[#EAE5DC] text-[#1A3D4F] rounded-2xl pl-11 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#1A3D4F] shadow-xs resize-none"
              />
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] border border-[#EAE5DC] rounded-2xl text-[11px] text-[#5F6B6F] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
            <span>Registration submits your canteen for Super Admin review. You can start adding menu dishes right away.</span>
          </div>

          <button
            type="submit"
            disabled={submitting || success}
            className="w-full bg-[#1A3D4F] hover:bg-[#2E5A66] active:scale-98 disabled:bg-[#EAE5DC] disabled:text-[#8A7F70] text-white font-sans font-extrabold py-3.5 rounded-2xl shadow-elevated flex items-center justify-center gap-2 text-sm transition mt-6"
          >
            {submitting ? (
              <span>Submitting Registration...</span>
            ) : (
              <>
                <span>Register Canteen & Open Portal</span>
                <ArrowRight className="w-4 h-4 text-[#E8B92C]" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Student Login */}
        <div className="mt-8 pt-6 border-t border-[#EAE5DC] text-center text-xs font-sans text-[#5F6B6F]">
          Are you a student looking to order food?{' '}
          <Link href="/login" className="font-bold text-[#E23744] hover:underline">
            Student Quick Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
