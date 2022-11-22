import { PATH } from '@/utils/constants';
import Img from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
      <div className="footer__main">
        <div className="footer__logo">
          <Link href={PATH.home}>
            <a>
              <Img src="/images/logo.png" alt="logo" width={25} height={25} />
              <span className="footer__logo-text">Crypto Digging</span>
            </a>
          </Link>
        </div>

        <span className="footer__copyright">
          &copy; R2Ws Team {currentYear}. All rights reserved
        </span>
      </div>
    </div>
  );
};

export default Footer;
