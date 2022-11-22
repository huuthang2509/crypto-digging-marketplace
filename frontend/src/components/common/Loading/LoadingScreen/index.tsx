import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';

const LoadingScreen: FC = () => {
  const [isHide, setHide] = useState<boolean>(false);

  let loadingScreenDuration: number = 1500;
  if (process.env.NEXT_PUBLIC_SCREEN_LOADING_DURATION) {
    loadingScreenDuration = +process.env.NEXT_PUBLIC_SCREEN_LOADING_DURATION;
  }

  useEffect(() => {
    setTimeout(() => {
      setHide(true);
    }, loadingScreenDuration);
  }, [loadingScreenDuration]);

  return (
    <div className={clsx('app-loading-screen', { 'app-loading-screen--hide': isHide })}>
      <div className="loader">
        <div className="loader__bar bar-1"></div>
        <div className="loader__bar bar-2"></div>
        <div className="loader__bar bar-3"></div>
        <div className="loader__bar bar-4"></div>
        <div className="loader__bar bar-5"></div>
        <div className="loader__bar bar-6"></div>
      </div>
      <span>Starting now...</span>
    </div>
  );
};

export default LoadingScreen;
