import Modal from '@/components/common/Modal';
import { useAppDispatch, useAppSelector, wrapper } from '@/redux/store';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  GlowWalletAdapter, PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter, TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import type { AppProps } from 'next/app';
import { useEffect, useMemo } from 'react';
import 'swiper/css/bundle';
import '../styles/index.scss';

function MyApp({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new GlowWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new TorusWalletAdapter(),
  ], [network]);
  const auth = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();

  useEffect(() => {
    if (!auth.isLoggedIn) return;
    // dispatch(getAccountBalance());
  }, [auth.isLoggedIn]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
          <Modal />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default wrapper.withRedux(MyApp);
