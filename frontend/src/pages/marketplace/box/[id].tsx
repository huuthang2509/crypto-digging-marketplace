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

const MarketplaceBoxDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const dispatch = useAppDispatch();
	const auth = useAppSelector(state => state.user);
    const { publicKey } = useWallet();

	useEffect(() => {
		async function getMarketItem() {
			try {
				if (!id) return;
				const res: any = await marketplaceAPI.getMarketItem(`${id}`);
				if (res.data.refType === MarketRefType.Hero) return;
				setBox(res.data);
			} catch (error) {
				dispatch(showModal(<ErrorPopup title='Error' description='' />));
			}
		};
		getMarketItem();
	}, [id]);

	const [box, setBox] = useState<any>(null);

	const handleBoxPurchase = () => {
		try {
			if (!publicKey) throw new WalletNotConnectedError("Wallet not connected");

			if (checkItemBelongsToOwner(box.ownerId)) throw new Error("You are the owner of this item!");
			
			dispatch(showModal(
				<MarketItemPurchaseCheckout
					userInfo={{}}
					data={box}
					onCancel={() => dispatch(closeModal())}
				/>
			));
		} catch (error: any) {
			const msg = error.message || JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
			dispatch(showModal(<ErrorPopup title='Fail to purchase' description={`Error: ${msg}`} />))
		}
	};

	const handleRemoveFromMarket = () => {
		try {
			if (!publicKey) throw new WalletNotConnectedError("Wallet not connected");
			
			if (!checkItemBelongsToOwner(box.ownerId)) throw new Error("You are not owner of this item!");

			dispatch(showModal(<RemoveItemFromMarketPopup data={box} onCancel={() => dispatch(closeModal())} />));
		} catch (error: any) {
			const msg = error.message || JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
			dispatch(showModal(<ErrorPopup title='Fail to purchase' description={`Error: ${msg}`} />))
		}
	};

	if (!box) return (
		<MarketLayout>
			<div id="marketplace-item-page">
				<div className="page-container">
					<EmptyMessage title = 'No item found' />
				</div>
			</div>
		</MarketLayout>
	);

	return (
		<MarketLayout title={`${box.itemCapture.boxInfoCapture.name} | Box | Crypto Digging Marketplace`}>
			<div id="marketplace-item-page">
				<div className="page-container">
					<div className='item box'>
						<div className='box__image'>
							<Img src={getImageURL(box.itemCapture.boxInfoCapture.img)} alt="box" layout='fill' objectFit='contain' />
						</div>
						<div className='box__info'>
							<h1 className='box__title'>{box.itemCapture.boxInfoCapture.name}</h1>
							<div className='box__specificiations'>
								<div className='box__specification'>
									<p className='box__specification-number'>{box.itemCapture.boxInfoCapture.commonRatio}</p>
									{" "}
									<p className='box__specification-text'>Common ratio</p>
								</div>
								<div className='box__specification'>
									<p className='box__specification-number'>{box.itemCapture.boxInfoCapture.epicRatio}</p>
									{" "}
									<p className='box__specification-text'>Epic ratio</p>
								</div>
								<div className='box__specification'>
									<p className='box__specification-number'>{box.itemCapture.boxInfoCapture.legendRatio}</p>
									{" "}
									<p className='box__specification-text'>Legend ratio</p>
								</div>
								<div className='box__specification'>
									<p className='box__specification-number'>{box.itemCapture.boxInfoCapture.rareRatio}</p>
									{" "}
									<p className='box__specification-text'>Rare ratio</p>
								</div>
							</div>
							<div className='box__price'>
								<Img src={'/images/cdg-icon.svg'} alt="coin" width={25} height={25} />
								<div className='box__price-text'>
									<span className='box__price-price'>{box.CDGPrice / LAMPORTS_PER_SOL}</span>
									{" "}
									<span>CDG</span>
								</div>
							</div>

							<div className='box__buttons'>
								{
									auth.isLoggedIn && checkItemBelongsToOwner(box.ownerId) ? (
										<button
											className={clsx("button box__remove")}
											onClick={handleRemoveFromMarket}
										>
											Remove from market
										</button>
									) : (
										<button
											className={clsx("button button--secondary box__purchase")}
											onClick={handleBoxPurchase}
										>
											Purchase
										</button>
									)
								}
							</div>

							<div className='item__owner'>
								<span>Owner: </span>
								<span className='item__owner-address'>{sliceWalletAddress(box.itemCapture?.owner?.walletAddress || "")}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MarketLayout>
	);
};

export default MarketplaceBoxDetailPage;
