import Link from 'next/link';
import { ChevronRight, Store, UtensilsCrossed } from 'lucide-react';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-10">
      <p className="text-sm font-bold uppercase tracking-widest text-brand">QueueLess</p>
      <h1 className="mt-2 text-4xl font-extrabold leading-tight">
        Order ahead.
        <br />
        Skip the queue.
      </h1>
      <p className="mt-3 text-muted">Customers order from their phone. Restaurants accept and set a ready time. Both sides update live.</p>

      <div className="mt-8 space-y-3">
        <RoleCard
          href="/customer"
          icon={<UtensilsCrossed size={24} />}
          title="I want to order food"
          text="Pick a restaurant, order, and see exactly when it'll be ready."
        />
        <RoleCard
          href="/restaurant"
          icon={<Store size={24} />}
          title="I own a restaurant"
          text="Register, add your menu, and accept orders in real time."
        />
      </div>
    </main>
  );
}

function RoleCard({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-brand/50 hover:shadow-sm"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">{icon}</div>
      <div className="flex-1">
        <p className="font-bold">{title}</p>
        <p className="text-sm text-muted">{text}</p>
      </div>
      <ChevronRight className="text-muted" size={20} />
    </Link>
  );
}
