'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronRight, LogOut, Minus, Plus, Store } from 'lucide-react';
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
  normalizePhone,
  placeOrder,
  setOrderStatus,
  watchCustomerOrders,
  watchMenu,
  watchRestaurants,
} from '@/lib/db';
import { useLive, useStoredState } from '@/lib/hooks';
import type { Customer, MenuItem, Order, Restaurant } from '@/lib/types';

export default function CustomerPage() {
  const [customer, setCustomer, loaded] = useStoredState<Customer | null>('queless:customer', null);

  if (!loaded) return <Loading />;
  if (!customer) return <Login onLogin={setCustomer} />;
  return <CustomerHome customer={customer} onLogout={() => setCustomer(null)} />;
}

/* ---------------- Login ---------------- */

function Login({ onLogin }: { onLogin: (c: Customer) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (normalizePhone(phone).length !== 10) return setError('Enter a 10-digit phone number.');
    onLogin({ name: name.trim(), phone: normalizePhone(phone) });
  };

  return (
    <>
      <TopBar title="Customer" />
      <Page>
        <h1 className="text-2xl font-extrabold">Order food</h1>
        <p className="mt-1 text-muted">Log in with your name and phone. Use the same phone number to see your orders on any device.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Your name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          <Field
            label="Phone number"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full">Continue</Button>
        </form>
      </Page>
    </>
  );
}

/* ---------------- Home ---------------- */

function CustomerHome({ customer, onLogout }: { customer: Customer; onLogout: () => void }) {
  const [tab, setTab] = useState<'order' | 'orders'>('order');
  const orders = useLive<Order>((cb) => watchCustomerOrders(customer.phone, cb), [customer.phone]);
  const active = orders?.filter((o) => ['pending', 'accepted', 'ready'].includes(o.status)) ?? [];

  useStatusAlerts(orders);

  return (
    <>
      <TopBar
        title={`Hi, ${customer.name.split(' ')[0]}`}
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
            { id: 'order', label: 'Order food' },
            { id: 'orders', label: 'My orders', count: active.length },
          ]}
        />
        {tab === 'order' ? (
          <OrderFood customer={customer} activeCount={active.length} onPlaced={() => setTab('orders')} onViewOrders={() => setTab('orders')} />
        ) : (
          <MyOrders orders={orders} />
        )}
      </Page>
    </>
  );
}

/** Beep/vibrate when the restaurant accepts an order or marks it ready. */
function useStatusAlerts(orders: Order[] | null) {
  const seen = useRef<Map<string, string> | null>(null);
  useEffect(() => {
    if (!orders) return;
    const prev = seen.current;
    if (prev && orders.some((o) => prev.has(o.id) && prev.get(o.id) !== o.status && ['accepted', 'ready'].includes(o.status))) {
      alertUser();
    }
    seen.current = new Map(orders.map((o) => [o.id, o.status]));
  }, [orders]);
}

/* ---------------- Ordering ---------------- */

function OrderFood({
  customer,
  activeCount,
  onPlaced,
  onViewOrders,
}: {
  customer: Customer;
  activeCount: number;
  onPlaced: () => void;
  onViewOrders: () => void;
}) {
  const restaurants = useLive<Restaurant>(watchRestaurants, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = restaurants?.find((r) => r.id === selectedId);

  if (!restaurants) return <Loading />;

  if (selected) {
    return <RestaurantMenu restaurant={selected} customer={customer} onBack={() => setSelectedId(null)} onPlaced={onPlaced} />;
  }

  return (
    <div className="space-y-3">
      {activeCount > 0 && (
        <button onClick={onViewOrders} className="flex w-full items-center justify-between rounded-2xl bg-brand/10 px-4 py-3 text-left text-sm font-semibold text-brand">
          You have {activeCount} active order{activeCount > 1 ? 's' : ''}. Track it
          <ChevronRight size={18} />
        </button>
      )}
      <h2 className="pt-1 text-lg font-bold">Restaurants</h2>
      {restaurants.length === 0 ? (
        <Empty title="No restaurants yet" hint="They appear here the moment a restaurant registers." />
      ) : (
        restaurants.map((r) => (
          <button key={r.id} onClick={() => setSelectedId(r.id)} className="w-full text-left">
            <Card className="flex items-center gap-3 transition hover:border-brand/40">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Store size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{r.name}</p>
                <p className="truncate text-sm text-muted">{r.location}</p>
              </div>
              <ChevronRight className="text-muted" size={18} />
            </Card>
          </button>
        ))
      )}
    </div>
  );
}

function RestaurantMenu({
  restaurant,
  customer,
  onBack,
  onPlaced,
}: {
  restaurant: Restaurant;
  customer: Customer;
  onBack: () => void;
  onPlaced: () => void;
}) {
  const menu = useLive<MenuItem>((cb) => watchMenu(restaurant.id, cb), [restaurant.id]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  // Only count items that are still on the menu and available
  const lines = useMemo(
    () =>
      (menu ?? [])
        .filter((m) => m.available && cart[m.id] > 0)
        .map((m) => ({ itemId: m.id, name: m.name, price: m.price, qty: cart[m.id] })),
    [menu, cart],
  );
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0);

  const change = (id: string, delta: number) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + delta) }));

  const submit = async () => {
    setPlacing(true);
    setError('');
    try {
      await placeOrder({ restaurant, customerName: customer.name, customerPhone: customer.phone, items: lines });
      onPlaced();
    } catch (e) {
      setError('Could not place the order. Check your connection and try again.');
      console.error(e);
      setPlacing(false);
    }
  };

  return (
    <div>
      <button onClick={onBack} className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted">
        <ArrowLeft size={16} /> All restaurants
      </button>
      <h2 className="text-xl font-extrabold">{restaurant.name}</h2>
      <p className="mb-4 text-sm text-muted">{restaurant.location}</p>

      {!menu ? (
        <Loading />
      ) : menu.length === 0 ? (
        <Empty title="No menu yet" hint="This restaurant hasn't added any dishes." />
      ) : (
        <div className="divide-y divide-line rounded-2xl border border-line bg-white">
          {menu.map((m) => (
            <div key={m.id} className={cx('flex items-center gap-3 p-4', !m.available && 'opacity-50')}>
              <VegDot isVeg={m.isVeg} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{m.name}</p>
                <p className="text-sm text-muted">{rupees(m.price)}</p>
              </div>
              {!m.available ? (
                <span className="text-xs font-semibold text-muted">Sold out</span>
              ) : cart[m.id] ? (
                <div className="flex items-center gap-1 rounded-xl border border-brand text-brand">
                  <button className="p-2" onClick={() => change(m.id, -1)} aria-label="Remove one">
                    <Minus size={16} />
                  </button>
                  <span className="w-5 text-center font-bold">{cart[m.id]}</span>
                  <button className="p-2" onClick={() => change(m.id, 1)} aria-label="Add one">
                    <Plus size={16} />
                  </button>
                </div>
              ) : (
                <Button variant="secondary" className="h-9 px-5 text-brand" onClick={() => change(m.id, 1)}>
                  Add
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white p-4">
          <div className="mx-auto max-w-2xl">
            {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
            <Button className="h-12 w-full justify-between text-base" onClick={submit} disabled={placing}>
              <span>
                {count} item{count > 1 ? 's' : ''} · {rupees(total)}
              </span>
              <span>{placing ? 'Placing…' : 'Place order'}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- My orders ---------------- */

function MyOrders({ orders }: { orders: Order[] | null }) {
  if (!orders) return <Loading />;
  if (orders.length === 0) return <Empty title="No orders yet" hint="Your orders and their live status show up here." />;
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <CustomerOrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}

function CustomerOrderCard({ order }: { order: Order }) {
  const [cancelling, setCancelling] = useState(false);

  return (
    <Card className={cx(order.status === 'ready' && 'border-emerald-300 ring-2 ring-emerald-100')}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-bold">{order.restaurantName}</p>
          <p className="text-xs text-muted">
            Ordered at {clock(order.createdAt)} · Code <span className="font-bold text-ink">{order.code}</span>
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {order.status === 'pending' && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Waiting for the restaurant to accept…
          </span>
          <button
            className="font-semibold underline disabled:opacity-50"
            disabled={cancelling}
            onClick={() => {
              setCancelling(true);
              setOrderStatus(order.id, 'cancelled').finally(() => setCancelling(false));
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {order.status === 'accepted' && (
        <div className="mb-3 rounded-xl bg-blue-50 p-3">
          <p className="mb-1 text-sm font-medium text-blue-900">Accepted. Your food will be ready in</p>
          <Countdown order={order} large />
        </div>
      )}

      {order.status === 'ready' && (
        <div className="mb-3 rounded-xl bg-emerald-50 p-3 text-emerald-900">
          <p className="font-bold">Your food is ready!</p>
          <p className="text-sm">
            Show code <span className="text-lg font-extrabold">{order.code}</span> at the counter.
          </p>
        </div>
      )}

      {order.status === 'rejected' && (
        <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">The restaurant couldn't take this order.</p>
      )}

      <OrderLines order={order} />
    </Card>
  );
}
