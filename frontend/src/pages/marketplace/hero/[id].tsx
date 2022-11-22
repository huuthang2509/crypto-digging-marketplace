import marketplaceAPI from '@/api/marketplace';
import MarketLayout from '@/components/common/Layout/MarketLayout';
import { EmptyMessage } from '@/components/EmptyMessage';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import MarketItemPurchaseCheckout from '@/components/Popup/MarketItemPurchaseCheckout';
import RemoveItemFromMarketPopup from '@/components/Popup/RemoveItemFromMarket';
import { MarketRefType } from '@/models/index';
import { closeModal, showModal } from '@/redux/slices/modal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { checkItemBelongsToOwner, getImageURL, sliceWalletAddress } from '@/utils/helpers';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import clsx from 'clsx';
import type { NextPage } from 'next';
import Img from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const MarketplaceHeroDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
    const { publicKey } = useWallet();

	const dispatch = useAppDispatch();
	const auth = useAppSelector(state => state.user);
	
	useEffect(() => {
		async function getMarketItem() {
			try {
				if (!id) return;
				const res: any = await marketplaceAPI.getMarketItem(`${id}`);
				if (res.data.refType === MarketRefType.Box) return;
				setHero(res.data);
			} catch (error) {
				dispatch(showModal(<ErrorPopup title='Error' description='' />));
			}
		};
		getMarketItem();
	}, [id]);

	const [hero, setHero] = useState<any>(null);

	const handleHeroPurchase = () => {
		try {
			if (!publicKey) throw new WalletNotConnectedError("Wallet not connected");

			if (checkItemBelongsToOwner(hero.ownerId)) throw new Error("You cannot purchase this item due to owner right!");
			
			dispatch(showModal(
				<MarketItemPurchaseCheckout 
					userInfo={{}} 
					data={hero} 
					onCancel={() => dispatch(closeModal())} 
				/>
			));
		} catch (error: any) {
			const msg = error.message || JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
			dispatch(showModal(<ErrorPopup title='Fail to purchase' description={`Error: ${msg}`} />))
		}
	}

	const handleRemoveFromMarket = () => {
		try {
			if (!publicKey) throw new WalletNotConnectedError("Wallet not connected");
			
			if (!checkItemBelongsToOwner(hero.ownerId)) throw new Error("You are not owner of this item!");

			dispatch(showModal(<RemoveItemFromMarketPopup data={hero} onCancel={() => dispatch(closeModal())} />));
		} catch (error: any) {
			const msg = error.message || JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
			dispatch(showModal(<ErrorPopup title='Fail to purchase' description={`Error: ${msg}`} />))
		}
	};

	if (!hero) return (
		<MarketLayout>
			<div id="marketplace-item-page">
				<div className="page-container">
					<EmptyMessage title = 'No item found' />
				</div>
			</div>
		</MarketLayout>
	);
	
	return (
		<MarketLayout title={`${hero.itemCapture.name} | Hero | Crypto Digging Marketplace`}>
			<div id="marketplace-item-page">
				<div className="page-container">
					<div className='item hero'>
						<div className='hero__image'>
							<Img src={getImageURL(hero.itemCapture.image)} alt="box" layout='fill' objectFit='contain' />
						</div>
						<div className='hero__info'>
							<h1 className='hero__title'>{hero.itemCapture.name}</h1>
							<div className='hero__type'>
								<Img src={'/images/hero-icon.png'} width={26} height={26} />
								<span>{hero.itemCapture.quality}</span>
							</div>
							<div className='hero__specifications'>
								<div className='hero__specification'>
									<Img src={'/images/darts.png'} alt="box" width={25} height={25} />
									<div className='hero__specification-right'>
										<p className='hero__specification-number'>{hero.itemCapture.statistic?.animationSpeed}</p>
										{" "}
										<p className='hero__specification-text'>Animation speed</p>
									</div>
								</div>
								<div className='hero__specification'>
									<Img src={'/images/acceleration.png'} alt="box" width={25} height={25} />
									<div className='hero__specification-right'>
										<p className='hero__specification-number'>{hero.itemCapture.statistic?.moveSpeed}</p>
										{" "}
										<p className='hero__specification-text'>Move speed</p>
									</div>
								</div>
								<div className='hero__specification'>
									<Img src={'/images/health.png'} alt="box" width={25} height={25} />
									<div className='hero__specification-right'>
										<p className='hero__specification-number'>{hero.itemCapture.statistic?.stamina}</p>
										{" "}
										<p className='hero__specification-text'>Stamina</p>
									</div>
								</div>
								<div className='hero__specification'>
									<Img src={'/images/gem.svg'} alt="box" width={25} height={25} />
									<div className='hero__specification-right'>
										<p className='hero__specification-number'>{hero.itemCapture.statistic?.gemEarn}</p>
										{" "}
										<p className='hero__specification-text'>Gem earn</p>
									</div>
								</div>
							</div>
							<div className='hero__price'>
								<Img src={'/images/cdg-icon.svg'} alt="coin" width={25} height={25} />
								<div className='hero__price-text'>
									<span className='hero__price-price'>{hero.CDGPrice / LAMPORTS_PER_SOL}</span>
									{" "}
									<span>CDG</span>
								</div>
							</div>
							<div className='hero__buttons'>
								{
									auth.isLoggedIn && checkItemBelongsToOwner(hero.ownerId) ? (
										<button
											className={clsx("button box__remove")}
											onClick={handleRemoveFromMarket}
										>
											Remove from market
										</button>
									) : (
										<button 
											className={clsx("button button--secondary hero__purchase")}
											onClick={handleHeroPurchase}
										>
											Purchase
										</button>
									)
								}
							</div>
							<div className='item__owner'>
								<span>Owner: </span>
								<span className='item__owner-address'>{sliceWalletAddress(hero.itemCapture?.owner?.walletAddress || "")}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MarketLayout>
	);
};

export default MarketplaceHeroDetailPage;
