import boxApi from '@/api/box';
import MarketLayout from '@/components/common/Layout/MarketLayout';
import BoxPurchaseCheckout from '@/components/Popup/MasterBoxPurchaseCheckout';
import MessagePopup from '@/components/Popup/MessagePopup';
import PurchaseControlledButton from '@/components/PurchaseButton';
import { BoxesTypes } from '@/models/index';
import { closeModal, showModal } from '@/redux/slices/modal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getImageURL } from '@/utils/helpers';
import type { NextPage } from 'next';
import { GetStaticPaths, GetStaticProps } from 'next';
import Img from 'next/image';

interface PageProps {
	box: BoxesTypes
}

const BoxDetail: NextPage<PageProps> = ({ box }) => {
	const auth = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();

	const handleClickPurchase = (quantity: number, box: BoxesTypes) => {
		if (!auth.isLoggedIn) {
			dispatch(showModal(
				<MessagePopup
					title='Connect Wallet'
					description='You need to connect wallet before purchasing this item'
				/>))
			return;
		};
		if (quantity <= 0) return;
		dispatch(showModal(
			<BoxPurchaseCheckout 
				userInfo={{}}
				quantity={quantity} 
				data={box} 
				onCancel={() => dispatch(closeModal())} />
			));
	};

	if (!box) return (
		<MarketLayout>
			<div id="marketplace-boxes-page">
				<div className="page-container">
					<Img src={'/images/box-empty.png'} alt="empty" width={100} height={100} />
					<p>NOT FOUND</p>
				</div>
			</div>
		</MarketLayout>
	);

	return (
		<MarketLayout title={`${box.name} | Masterdata Box | Crypto Digging Marketplace`}>
			<div id="marketplace-box-page">
				<div className="page-container">
					<div className='box'>
						<div className='box__image'>
							<Img src={getImageURL(box.img)} alt="box" layout='fill' objectFit='contain' />
						</div>
						<div className='box__info'>
							<h1 className='box__title'>{box.name}</h1>
							<div className='box__specificiations'>
								<div className='box__specification'>
									<p className='box__specification-number'>{box.commonRatio}</p>
									{" "}
									<p className='box__specification-text'>Common ratio</p>
								</div>
								<div className='box__specification'>
									<p className='box__specification-number'>{box.epicRatio}</p>
									{" "}
									<p className='box__specification-text'>Epic ratio</p>
								</div>
								<div className='box__specification'>
									<p className='box__specification-number'>{box.legendRatio}</p>
									{" "}
									<p className='box__specification-text'>Legend ratio</p>
								</div>
								<div className='box__specification'>
									<p className='box__specification-number'>{box.rareRatio}</p>
									{" "}
									<p className='box__specification-text'>Rare ratio</p>
								</div>
							</div>
							<div className='box__price'>
								<Img src={'/images/cdg-icon.svg'} alt="coin" width={30} height={30} />
								<div className='box__price-text'>
									<span className='box__price-price'>{box.CDGPrice}</span>
									{" "}
									<span>CDG</span>
								</div>
							</div>
							<PurchaseControlledButton onPurchase={(quantity) => handleClickPurchase(quantity, box)} />
						</div>
					</div>
				</div>
			</div>
		</MarketLayout>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	try {
		const boxes = await boxApi.getBoxes();

		const paths = boxes.data.map((box: any) => ({
			params: { slug: `${box.name}` },
		})) || [];

		return { paths, fallback: true }
	} catch (error) {
	  return { paths: [], fallback: true }
	}
  };

export const getStaticProps: GetStaticProps = async (context) => {
	try {
		const { slug } = context.params as { slug: string };
		const boxes = await boxApi.getBoxes();
		const box = boxes.data.find((item: any) => item.name === slug)

		if (!box) {
			return {
				props: {
					box: null
				},
				revalidate: 10
			};
		};
		return {
			props: {
				box
			},
			revalidate: 10
		}
	} catch (error) {
		return {
			props: {
				box: null
			},
			revalidate: 10
		};
	}
}

export default BoxDetail;
