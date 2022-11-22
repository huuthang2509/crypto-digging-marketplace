import MarketLayout from '@/components/common/Layout/MarketLayout';
import ClaimGemToTokenPopup from '@/components/Popup/ClaimGemToToken';
import Section from '@/components/Section';
import { closeModal, showModal } from '@/redux/slices/modal';
import { getGameBalance } from '@/redux/slices/user';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import type { NextPage } from 'next';
import Img from 'next/image';
import { useEffect } from 'react';

const WalletPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getGameBalance())
  }, []);

  const openWithdrawToTokenPopup = () => {
    dispatch(showModal(
      <ClaimGemToTokenPopup onCancel={() => dispatch(closeModal())}/>
    ));
  };
  
  return (
    <MarketLayout title="Wallet and Transaction | Crypto Digging Marketplace">
      <div id="wallet-page">
        <div className="page-container">
          <Section title="Ingame Currency" className="ingame-currency">
            <div className="boxes">
              <div className="box">
                <div className="box__icon">
                  <Img src={'/images/cdg-icon.svg'} alt="gem" width={40} height={40} />
                </div>
                <div className="box__top">
                  <p className="box__name">Cryto digging GEM</p>
                  <div>
                    <span>Balance: </span>
                    <span className="box__game-balance">{userInfo.gameBalance.balance}</span>
                  </div>
                </div>
                <button className="button button--primary button__claim" onClick={openWithdrawToTokenPopup}>
                  Claim
                </button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </MarketLayout>
  );
};

export default WalletPage;
