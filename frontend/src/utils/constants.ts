export const PATH = {
  home: '/',
  marketplace: '/marketplace',
  about: '/about-us',
  game: '/crypto-digging',
  inventory: '/profile/inventory',
  wallet: '/profile/wallet',
  boxes: '/marketplace/boxes',
  profileHistory: '/profile/history',
  exchange: '/profile/exchange',
};

export const ACCESS_TOKEN = 'ACCESS_TOKEN';

export const TRANSACTION_FEE: number = Number(process.env.NEXT_PUBLIC_FEE) || 0.01;
export const POOL_WALLET_ADDRESS: string = process.env.NEXT_PUBLIC_POOL_WALLET_ADDRESS || '';

// 1 sol = 111 CDG
export const solExchange = 111;
export const CDGExchange = 1 / 111;
