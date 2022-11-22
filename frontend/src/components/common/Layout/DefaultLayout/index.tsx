import LoadingScreen from '@/components/common/Loading/LoadingScreen';
import { disableAppLoadingScreen } from '@/redux/slices/general';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { ACCESS_TOKEN } from '@/utils/constants';
import Head from 'next/head';
import React, { useEffect } from 'react';
import Footer from '../partials/Footer';
import Header from '../partials/Header/DefaultHeader';

interface Props {
  title?: string;
}

const DefaultLayout: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const { title, children } = props;
  const { showLoading } = useAppSelector((state) => state.general);

  let loadingScreenDuration: number = 1500;
  if (process.env.NEXT_PUBLIC_SCREEN_LOADING_DURATION) {
    loadingScreenDuration = +process.env.NEXT_PUBLIC_SCREEN_LOADING_DURATION;
  }
  useEffect(() => {
    setTimeout(() => {
      dispatch(disableAppLoadingScreen({}));
    }, loadingScreenDuration + 500);
  }, [loadingScreenDuration]);

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

      {showLoading && <LoadingScreen />}

      <div className="app-wrapper">
        <Header />

        <div className="app-wrapper__body">{children}</div>

        <Footer />
      </div>
    </>
  );
};

export default DefaultLayout;
