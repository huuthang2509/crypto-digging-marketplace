import { useAppSelector } from '@/redux/store';
import { ACCESS_TOKEN } from '@/utils/constants';
import Head from 'next/head';
import React, { useEffect } from 'react';
import Footer from '../partials/Footer';
import MarketplaceHeader from '../partials/Header/MarketplaceHeader';

interface Props {
  title?: string;
}

const MarketLayout: React.FC<Props> = ({ title, children }) => {
  const user = useAppSelector(state => state.user);

  useEffect(() => {
    if (!user.isLoggedIn) {
      localStorage.removeItem("walletName");
      localStorage.removeItem(ACCESS_TOKEN);
    }
  }, []);
  
  return (
    <>
      <Head>
        <title>{title || 'Crypto Digging Marketplace'}</title>
      </Head>

      <div className="app-wrapper">
        <MarketplaceHeader />

        <div className="app-wrapper__body">{children}</div>

        <Footer />
      </div>
    </>
  );
};

export default MarketLayout;
