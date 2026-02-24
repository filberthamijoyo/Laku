'use client';

import { Store } from '@/types/store';
import { StoreLogo } from './StoreLogo';
import { StoreInfo } from './StoreInfo';

interface MobileStoreBioNameProps {
  store: Store;
}

export function MobileStoreBioName({ store }: MobileStoreBioNameProps) {
  return (
    /* Store profile - logo and info */
    <div className="flex items-center gap-4 pl-4 pr-4">
      <StoreLogo store={store} />
      <div className="flex-1">
        <StoreInfo store={store} />
      </div>
    </div>
  );
}
