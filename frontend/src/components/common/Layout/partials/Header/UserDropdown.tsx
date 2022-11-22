import OnClickOutside from '@/hooks/onClickOutside';
import { setLoggedIn } from '@/redux/slices/user';
import { useAppDispatch } from '@/redux/store';
import { ACCESS_TOKEN, PATH } from '@/utils/constants';
import { sliceWalletAddress } from '@/utils/helpers';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import clsx from 'clsx';
import Img from 'next/image';
import Link from 'next/link';
import React, { useMemo, useRef, useState } from 'react';

interface Props {
  connected?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

const UserDropdown: React.FC<Props> = (props) => {
	const dispatch = useAppDispatch();
  const { connected, onConnect, onDisconnect } = props;
  const { publicKey } = useWallet();
  
  const menu = useMemo(
    () => [
      {
        icon: '/images/box-icon.svg',
        text: 'Inventory',
        link: PATH.inventory,
      },
      {
        icon: '/images/currency-exchange.svg',
        text: 'Exchange',
        link: PATH.exchange,
      },
      {
        icon: '/images/wallet.svg',
        text: 'Wallet',
        link: PATH.wallet,
      },
      {
        icon: '/images/history.svg',
        text: 'My history',
        link: PATH.profileHistory,
      },
    ],
    []
  );

  const avatarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggleAvatarDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  OnClickOutside(
    dropdownRef,
    () => {
      setDropdownOpen(false);
    },
    avatarRef
  );

  const disconnect = () => {
    dispatch(setLoggedIn(false));
    localStorage.removeItem(ACCESS_TOKEN);
  }

  return (
    <div className="user">
      <div className="user__avatar" ref={avatarRef} onClick={toggleAvatarDropdown}>
        {connected ? (
          <Img src={'/images/avatar-man.png'} alt="avatar" width={40} height={40} />
        ) : (
          <Img src="/images/account.svg" alt="account" width={30} height={30} />
        )}
      </div>

      <div
        ref={isDropdownOpen ? dropdownRef : null}
        className={clsx('user__menu', { 'user__menu--open': isDropdownOpen })}
      >
        <ul>
          {connected ? (
            <>
              {
                publicKey && <div className='user__menu-wallet-address'>
                  <Img src={'/images/wallet-1.png'} alt="wallet" width={22} height={22} />
                  <span>{sliceWalletAddress(publicKey.toBase58())}</span>
                </div>
              }
              {menu.map((menu: any, index: number) => {
                return (
                  <li className="user__menu-item" key={`user-menu-item-${index + 1}`}>
                    <Link href={menu.link}>
                      <a onClick={() => setDropdownOpen(false)}>
                        {menu.icon && <Img src={menu.icon} alt="icon" width={22} height={22} />}
                        <span>{menu.text}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
              <li className="user__menu-item user__logout">
                <WalletDisconnectButton onClick={disconnect} />
              </li>
            </>
          ) : (
            <li className="user__menu-item">
              <WalletMultiButton />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserDropdown;
