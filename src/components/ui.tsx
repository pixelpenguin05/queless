'use client';

import Link from 'next/link';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import type { OrderStatus } from '@/lib/types';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export function TopBar({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
        <Link href="/" className="font-extrabold text-brand">
          QueueLess
        </Link>
        <span className="text-line">/</span>
        <span className="truncate font-semibold">{title}</span>
        <div className="ml-auto flex items-center gap-2">{right}</div>
      </div>
    </header>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-2xl px-4 py-5 pb-32">{children}</main>;
}

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={cx(
        'inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-brand text-white hover:bg-brand-dark',
        variant === 'success' && 'bg-emerald-600 text-white hover:bg-emerald-700',
        variant === 'secondary' && 'border border-line bg-white text-ink hover:bg-gray-50',
        variant === 'ghost' && 'text-muted hover:bg-gray-100',
        variant === 'danger' && 'border border-red-200 bg-white text-red-600 hover:bg-red-50',
        className,
      )}
    />
  );
}

export function Field({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      <input
        {...props}
        className="h-11 w-full rounded-xl border border-line bg-white px-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('rounded-2xl border border-line bg-white p-4', className)}>{children}</div>;
}

export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
}: {
  value: T;
  onChange: (v: T) => void;
  tabs: { id: T; label: string; count?: number }[];
}) {
  return (
    <div className="mb-5 grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-gray-100 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cx(
            'flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition',
            value === t.id ? 'bg-white text-ink shadow-sm' : 'text-muted',
          )}
        >
          {t.label}
          {!!t.count && (
            <span className="rounded-full bg-brand px-1.5 text-xs leading-5 text-white">{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-10 text-center">
      <p className="font-semibold">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function Loading() {
  return <p className="py-10 text-center text-sm text-muted">Loading…</p>;
}

export function VegDot({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      title={isVeg ? 'Veg' : 'Non-veg'}
      className={cx(
        'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-2',
        isVeg ? 'border-emerald-600' : 'border-red-600',
      )}
    >
      <span className={cx('h-1.5 w-1.5 rounded-full', isVeg ? 'bg-emerald-600' : 'bg-red-600')} />
    </span>
  );
}

const STATUS: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: 'Waiting for restaurant', cls: 'bg-amber-100 text-amber-800' },
  accepted: { label: 'Preparing', cls: 'bg-blue-100 text-blue-800' },
  ready: { label: 'Ready for pickup', cls: 'bg-emerald-100 text-emerald-800' },
  completed: { label: 'Picked up', cls: 'bg-gray-100 text-gray-700' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-500' },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS[status];
  return <span className={cx('rounded-full px-2.5 py-1 text-xs font-semibold', s.cls)}>{s.label}</span>;
}

export const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;
export const clock = (ms: number) =>
  new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export { cx };
