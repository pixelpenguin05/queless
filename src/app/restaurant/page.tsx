'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { LogOut, Phone, Trash2 } from 'lucide-react';
import { Countdown, OrderLines } from '@/components/order';
import {
  Button,
  Card,
  Empty,
  Field,
  Loading,
  Page,
  StatusBadge,
  Tabs,
  TopBar,
  VegDot,
  clock,
  cx,
  rupees,
} from '@/components/ui';
import { alertUser } from '@/lib/alert';
import {
  acceptOrder,
  addMenuItem,
  deleteMenuItem,
  extendOrder,
  findRestaurantByPhone,
  normalizePhone,
  registerRestaurant,
  setMenuItemAvailable,
  setOrderStatus,
  watchMenu,
  watchRestaurantOrders,
} from '@/lib/db';
import { useLive, useStoredState } from '@/lib/hooks';
import type { MenuItem, Order, Restaurant } from '@/lib/types';

export default function RestaurantPage() {
  const [restaurant, setRestaurant, loaded] = useStoredState<Restaurant | null>('queless:restaurant', null);

  if (!loaded) return <Loading />;
  if (!restaurant) return <Auth onDone={setRestaurant} />;
  return <Dashboard restaurant={restaurant} onLogout={() => setRestaurant(null)} />;
}

/* ---------------- Register / log in ---------------- */

function Auth({ onDone }: { onDone: (r: Restaurant) => void }) {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [form, setForm] = useState({ name: '', ownerName: '', phone: '', location: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (normalizePhone(form.phone).length !== 10) return setError('Enter a 10-digit phone number.');
    setBusy(true);
    try {
      if (mode === 'register') {
        onDone(
          await registerRestaurant({
            name: form.name.trim(),
            ownerName: form.ownerName.trim(),
            phone: form.phone,
            location: form.location.trim(),
          }),
        );
      } else {
        const r = await findRestaurantByPhone(form.phone);
        if (!r) throw new Error('No restaurant found with this phone number. Register first.');
        onDone(r);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setBusy(false);
    }
  };

  return (
    <>
      <TopBar title="Restaurant" />
      <Page>
        <h1 className="text-2xl font-extrabold">{mode === 'register' ? 'Register your restaurant' : 'Restaurant log in'}</h1>
        <p className="mt-1 text-muted">
          {mode === 'register'
            ? 'Customers see your restaurant right after you register.'
            : 'Log in with the phone number you registered with.'}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <>
              <Field label="Restaurant name" value={form.name} onChange={set('name')} required autoFocus />
              <Field label="Owner name" value={form.ownerName} onChange={set('ownerName')} required />
              <Field label="Location / counter" placeholder="e.g. Block B, Food Court" value={form.location} onChange={set('location')} required />
            </>
          )}
          <Field label="Phone number" type="tel" inputMode="numeric" value={form.phone} onChange={set('phone')} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'register' ? 'Register' : 'Log in'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {mode === 'register' ? 'Already registered?' : 'New restaurant?'}{' '}
          <button
            className="font-semibold text-brand"
            onClick={() => {
              setMode(mode === 'register' ? 'login' : 'register');
              setError('');
            }}
          >
            {mode === 'register' ? 'Log in' : 'Register'}
          </button>
        </p>
      </Page>
    </>
  );
}

/* ---------------- Dashboard ---------------- */

function Dashboard({ restaurant, onLogout }: { restaurant: Restaurant; onLogout: () => void }) {
  const [tab, setTab] = useState<'orders' | 'menu'>('orders');
  const orders = useLive<Order>((cb) => watchRestaurantOrders(restaurant.id, cb), [restaurant.id]);
  const menu = useLive<MenuItem>((cb) => watchMenu(restaurant.id, cb), [restaurant.id]);
  const pendingCount = orders?.filter((o) => o.status === 'pending').length ?? 0;

  useNewOrderAlert(orders);

  return (
    <>
      <TopBar
        title={restaurant.name}
        right={
          <Button variant="ghost" className="h-9 px-2" onClick={onLogout} aria-label="Log out">
            <LogOut size={18} />
          </Button>
        }
      />
      <Page>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'orders', label: 'Orders', count: pendingCount },
            { id: 'menu', label: `Menu${menu ? ` (${menu.length})` : ''}` },
          ]}
        />
        {tab === 'orders' ? (
          <Orders orders={orders} hasMenu={!!menu?.length} onGoToMenu={() => setTab('menu')} />
        ) : (
          <MenuEditor restaurantId={restaurant.id} menu={menu} />
        )}
      </Page>
    </>
  );
}

/** Beep/vibrate when a new order arrives. */
function useNewOrderAlert(orders: Order[] | null) {
  const known = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!orders) return;
    if (known.current && orders.some((o) => o.status === 'pending' && !known.current!.has(o.id))) {
      alertUser();
    }
    known.current = new Set(orders.map((o) => o.id));
  }, [orders]);
}

/* ---------------- Orders ---------------- */

function Orders({ orders, hasMenu, onGoToMenu }: { orders: Order[] | null; hasMenu: boolean; onGoToMenu: () => void }) {
  if (!orders) return <Loading />;

  const pending = orders.filter((o) => o.status === 'pending').reverse(); // oldest first
  const cooking = orders.filter((o) => o.status === 'accepted').sort((a, b) => (a.readyBy ?? 0) - (b.readyBy ?? 0));
  const ready = orders.filter((o) => o.status === 'ready');
  const done = orders.filter((o) => ['completed', 'rejected', 'cancelled'].includes(o.status)).slice(0, 10);

  if (orders.length === 0) {
    return hasMenu ? (
      <Empty title="No orders yet" hint="New orders pop up here instantly, with a sound." />
    ) : (
      <div className="space-y-3">
        <Empty title="Add your menu first" hint="Customers can only order once you have dishes on your menu." />
        <Button className="w-full" onClick={onGoToMenu}>
          Add dishes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Section title="New orders" count={pending.length}>
        {pending.map((o) => (
          <PendingCard key={o.id} order={o} />
        ))}
      </Section>
      <Section title="Preparing" count={cooking.length}>
        {cooking.map((o) => (
          <CookingCard key={o.id} order={o} />
        ))}
      </Section>
      <Section title="Ready for pickup" count={ready.length}>
        {ready.map((o) => (
          <ReadyCard key={o.id} order={o} />
        ))}
      </Section>
      <Section title="Recent" count={done.length}>
        {done.map((o) => (
          <Card key={o.id} className="flex items-center justify-between gap-2 py-3">
            <span className="text-sm">
              <span className="font-semibold">{o.customerName}</span> · {rupees(o.total)} · {clock(o.createdAt)}
            </span>
            <StatusBadge status={o.status} />
          </Card>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <section>
      <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">
        {title} · {count}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function OrderHeader({ order }: { order: Order }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-2">
      <div>
        <p className="font-bold">{order.customerName}</p>
        <a href={`tel:${order.customerPhone}`} className="inline-flex items-center gap-1 text-xs text-muted">
          <Phone size={12} /> {order.customerPhone} · {clock(order.createdAt)}
        </a>
      </div>
      <span className="rounded-lg bg-gray-100 px-2 py-1 text-sm font-bold">#{order.code}</span>
    </div>
  );
}

const PREP_TIMES = [10, 15, 20, 30];

function PendingCard({ order }: { order: Order }) {
  const [minutes, setMinutes] = useState(15);
  const [busy, setBusy] = useState(false);
  const run = (fn: () => Promise<void>) => {
    setBusy(true);
    fn().catch((e) => {
      console.error(e);
      setBusy(false);
    });
  };

  return (
    <Card className="border-amber-300 ring-2 ring-amber-100">
      <OrderHeader order={order} />
      <OrderLines order={order} />
      <p className="mb-2 mt-4 text-sm font-medium">Ready in</p>
      <div className="mb-3 grid grid-cols-4 gap-2">
        {PREP_TIMES.map((m) => (
          <button
            key={m}
            onClick={() => setMinutes(m)}
            className={cx(
              'h-10 rounded-xl border text-sm font-semibold',
              minutes === m ? 'border-brand bg-brand/10 text-brand' : 'border-line',
            )}
          >
            {m} min
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_2fr] gap-2">
        <Button variant="danger" disabled={busy} onClick={() => run(() => setOrderStatus(order.id, 'rejected'))}>
          Reject
        </Button>
        <Button disabled={busy} onClick={() => run(() => acceptOrder(order.id, minutes))}>
          Accept · {minutes} min
        </Button>
      </div>
    </Card>
  );
}

function CookingCard({ order }: { order: Order }) {
  return (
    <Card>
      <OrderHeader order={order} />
      <div className="mb-3">
        <Countdown order={order} />
      </div>
      <OrderLines order={order} />
      <div className="mt-4 grid grid-cols-[1fr_2fr] gap-2">
        <Button variant="secondary" onClick={() => extendOrder(order, 5)}>
          +5 min
        </Button>
        <Button variant="success" onClick={() => setOrderStatus(order.id, 'ready')}>
          Mark ready
        </Button>
      </div>
    </Card>
  );
}

function ReadyCard({ order }: { order: Order }) {
  return (
    <Card className="border-emerald-300">
      <OrderHeader order={order} />
      <p className="mb-3 text-sm text-muted">
        Hand over when the customer shows code <span className="font-bold text-ink">{order.code}</span>.
      </p>
      <OrderLines order={order} />
      <Button className="mt-4 w-full" variant="success" onClick={() => setOrderStatus(order.id, 'completed')}>
        Picked up
      </Button>
    </Card>
  );
}

/* ---------------- Menu ---------------- */

function MenuEditor({ restaurantId, menu }: { restaurantId: string; menu: MenuItem[] | null }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [busy, setBusy] = useState(false);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    const p = Number(price);
    if (!name.trim() || !(p > 0)) return;
    setBusy(true);
    try {
      await addMenuItem({ restaurantId, name: name.trim(), price: p, isVeg });
      setName('');
      setPrice('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <form onSubmit={add} className="space-y-3">
          <p className="font-bold">Add a dish</p>
          <div className="grid grid-cols-[2fr_1fr] gap-2">
            <Field label="Dish name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Field label="Price (₹)" type="number" inputMode="numeric" min={1} value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[true, false].map((v) => (
              <button
                type="button"
                key={String(v)}
                onClick={() => setIsVeg(v)}
                className={cx(
                  'flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold',
                  isVeg === v ? 'border-ink bg-gray-50' : 'border-line text-muted',
                )}
              >
                <VegDot isVeg={v} /> {v ? 'Veg' : 'Non-veg'}
              </button>
            ))}
          </div>
          <Button className="w-full" disabled={busy}>
            {busy ? 'Adding…' : 'Add to menu'}
          </Button>
        </form>
      </Card>

      {!menu ? (
        <Loading />
      ) : menu.length === 0 ? (
        <Empty title="Your menu is empty" hint="Dishes you add show up for customers instantly." />
      ) : (
        <div className="divide-y divide-line rounded-2xl border border-line bg-white">
          {menu.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-4">
              <VegDot isVeg={m.isVeg} />
              <div className={cx('min-w-0 flex-1', !m.available && 'opacity-50')}>
                <p className="truncate font-semibold">{m.name}</p>
                <p className="text-sm text-muted">{rupees(m.price)}</p>
              </div>
              <button
                onClick={() => setMenuItemAvailable(m.id, !m.available)}
                className={cx(
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  m.available ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600',
                )}
              >
                {m.available ? 'Available' : 'Sold out'}
              </button>
              <button
                onClick={() => confirm(`Delete "${m.name}"?`) && deleteMenuItem(m.id)}
                className="p-2 text-muted hover:text-red-600"
                aria-label={`Delete ${m.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
