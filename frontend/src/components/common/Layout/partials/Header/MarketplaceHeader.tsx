import { useSolanaAccount } from '@/hooks/useSolanaAccount';
import { useAppSelector } from '@/redux/store';
import { PATH } from '@/utils/constants';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import clsx from 'clsx';
import Img from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import MobileSideMenu from './MobileSideMenu';
import UserDropdown from './UserDropdown';

const MarketplaceHeader = () => {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const menuItems = useMemo(
    () => [
      {
        text: 'Master Boxes',
        link: PATH.boxes,
      },
      {
        text: 'Buy',
        link: PATH.marketplace,
      },
    ],
    []
  );

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const { publicKey, signMessage } = useWallet();
  const { account, transactions } = useSolanaAccount();

  const auth = useAppSelector(state => state.user);
  
  return (
    <>
      <header className="header header__marketplace">
        <div className="header__main">
          <div
            className={clsx('header__menu-hamburger', {
              'header__menu-hamburger--open': showMobileMenu,
            })}
            onClick={toggleMobileMenu}
          >
            <div className="bar bar-1"></div>
            <div className="bar bar-2"></div>
            <div className="bar bar-3"></div>
          </div>
		  
          <div className='header__marketplace-left'>
            <Link href={PATH.home}>
              <a>
                <Img src="/images/logo.png" alt="logo" width={50} height={50} />
              </a>
            </Link>
            <ul className="header__menu header__marketplace-menu">
              {menuItems.map((menu: any, index: number) => {
                const isActiveMenu = router.pathname === menu.link;
                return (
                  <li
                    className={clsx('menu__item', { 'menu__item--active': isActiveMenu })}
                    key={`menu-item-${index + 1}`}
                  >
                    <Link href={menu.link}>
                      <a>{menu.text}</a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {
            !publicKey || !auth.isLoggedIn ? (
              <>
                <div className="header__mobile-account">
                  <UserDropdown />
                </div>
                <div className="header__connect">
                  <WalletMultiButton />
                </div>
              </>
            ) : (
              <UserDropdown connected />
            )
          }
        </div>

        <MobileSideMenu
          menuList={menuItems}
          show={showMobileMenu}
          onCloseMobileMenu={() => setShowMobileMenu(false)}
          currentPath={router.pathname}
        />
      </header>
    </>
  );
};

export default MarketplaceHeader;
