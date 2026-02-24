 'use client';

import { Store } from '@/types/store';

export function StoreInfo({ store }: { store: Store }) {
  return (
    <div>
      <h1 style={{ fontWeight: 600 }} className="text-l font-bold text-white">{store.name}</h1>
    </div>
  );
}

