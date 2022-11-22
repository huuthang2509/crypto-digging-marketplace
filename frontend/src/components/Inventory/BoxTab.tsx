import WindMillLoading from '@/components/common/Loading/Windmill-Loading';
import Pagination from '@/components/common/Pagination';
import { EmptyMessage } from '@/components/EmptyMessage';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import FillListingPricePopup from '@/components/Popup/FillListingPricePopup';
import InventoryInfoPopup from '@/components/Popup/InventoryInfoPopup';
import OpenBoxConfirmationPopup from '@/components/Popup/OpenBox/ConfirmPopup';
import RemoveItemFromMarketPopup from '@/components/Popup/RemoveItemFromMarket';
import { MarketRefType } from '@/models/index';
import { closeModal, showModal } from '@/redux/slices/modal';
import { useAppDispatch } from '@/redux/store';
import { getImageURL } from '@/utils/helpers';
import clsx from 'clsx';
import Img from 'next/image';
import React from 'react';

interface Props {
	loading: boolean
	boxInventory: any[]
	total: number
	currentPage: number
	totalPages: number
	onSearch: (queries: any) => void
}

export const BoxTab: React.FC<Props> = ({ loading, boxInventory = [], total, currentPage, totalPages, onSearch }) => {
	const dispatch = useAppDispatch();

	const handleOpenBox = async (boxId: string) => {
		dispatch(showModal(<OpenBoxConfirmationPopup boxId={boxId} />));
	}
	
	const handleOpenFillPricePopup = (box: any) => {
		dispatch(showModal(<FillListingPricePopup defaultPrice={+box.boxInfoCapture.CDGPrice} type={MarketRefType.Box} item={box} />))
	};

	const handleOpenInfoPopup = (hero: any) => {
		dispatch(showModal(<InventoryInfoPopup data={hero} type={MarketRefType.Box} />))
	}

	const openRemoveFromMarketConfirmPopup = (box: any) => {
		try {
			dispatch(showModal(
				<RemoveItemFromMarketPopup 
					data={{ refId: box.id, refType: MarketRefType.Box }} 
					onCancel={() => dispatch(closeModal())} 
				/>
			));
		} catch (error: any) {
			const msg = error.message || JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
			dispatch(showModal(<ErrorPopup title='Fail to purchase' description={`Error: ${msg}`} />))
		}
	}

	return (
		<div>
			{
				loading ? <WindMillLoading /> : (
					boxInventory.length !== 0 ? (
						<div className='boxes'>
							{
								boxInventory.map((box: any) => (
									<div className='box' key={`box-${box.id}`}>
										<div className='box__image'>
											<Img 
												src={getImageURL(box.boxInfoCapture.img)}
												alt="box" width={156} height={125}
											/>
										</div>
										<h3 className='box__title'>{box.boxInfoCapture.name}</h3>
										<div className='box__price'>
											<span>Price</span>
											<div className='box__price-right'>
												<Img src={'/images/cdg-icon.svg'} alt="coin" width={25} height={25} />
												<span>{box.boxInfoCapture.CDGPrice}</span>
											</div>
										</div>
										{
											!box.isOnMarket && (
												box.isOpened ? (
													<div className='box__listed-msg'>
														<Img src={'/images/box-empty.png'} width={20} height={20} />
														<span>Box opened</span>
													</div>
												) : (
													<button 
														className={clsx('button', 'box__open-button', { 
															'button--disabled': box.isOpened, 
															'button--primary': !box.isOpened 
														})}
														disabled={box.isOpened}
														onClick={() => handleOpenBox(box.id)}
													>
														Open Box
													</button>
												)
											)
										}
										{
											box.isOnMarket ? (
												<>
													<div className='box__listed-msg'>
														<Img src={'/images/market.png'} width={20} height={20} />
														<span>Listed on market</span>
													</div>
													<button
														className={clsx("button button--danger box__remove")}
														onClick={() => openRemoveFromMarketConfirmPopup(box)}
													>
														Remove from market
													</button>
												</>
											) : (
												<button 
													className={clsx('button button--secondary box__listing-btn')}
													onClick={() => handleOpenFillPricePopup(box)}
												>
													List on market
												</button>
											)
										}
										<div className='box__see-more' onClick={() => handleOpenInfoPopup(box)}>
											<Img src={'/images/loupe.png'} width={30} height={30} />
										</div>
									</div>
								))
							}
						</div>
				) : (
					<EmptyMessage />
				))
			}
			{
				total > 0 && (
					<div className='pagination'>
						<Pagination 
							currentPage={currentPage} 
							totalPage={totalPages} 
							setPage={page => onSearch({ page })} 
						/>
					</div>
				)
			}
		</div>
	)
}
