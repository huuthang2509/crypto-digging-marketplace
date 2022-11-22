import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

interface Props {
  show: boolean;
  menuList: any[];
  onCloseMobileMenu: () => void;
  currentPath: string;
}

const MobileSideMenu: React.FC<Props> = (props) => {
  const { show, menuList, onCloseMobileMenu, currentPath } = props;

  return (
    <>
      <div
        className={clsx('side-menu-overlay', { 'side-menu-overlay--active': show })}
        onClick={onCloseMobileMenu}
      ></div>

      <div className={clsx('side-menu', { 'side-menu--show': show })}>
        <ul>
          {menuList.map((menu: any, index: number) => {
            const isActiveMenu = currentPath === menu.link;

            return (
              <li
                className={clsx('side-menu__item', { 'side-menu__item--active': isActiveMenu })}
                key={`side-menu-item-${index + 1}`}
              >
                <Link href={menu.link}>
                  <a>{menu.text}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default MobileSideMenu;
