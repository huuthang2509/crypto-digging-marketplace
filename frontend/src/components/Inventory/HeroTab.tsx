import WindMillLoading from '@/components/common/Loading/Windmill-Loading';
import Pagination from '@/components/common/Pagination';
import { EmptyMessage } from '@/components/EmptyMessage';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import FillListingPricePopup from '@/components/Popup/FillListingPricePopup';
import InventoryInfoPopup from '@/components/Popup/InventoryInfoPopup';
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
	heroInventory: any[]
	total: number
	currentPage: number
	totalPages: number
	onSearch: (queries: any) => void
}

export const HeroesTab: React.FC<Props> = ({ loading, heroInventory, total, currentPage, totalPages, onSearch }) => {
	const dispatch = useAppDispatch();
	
	const handleOpenFillPricePopup = (hero: any) => {
		dispatch(showModal(<FillListingPricePopup item={hero} type={MarketRefType.Hero} />))
	};

	const handleOpenInfoPopup = (hero: any) => {
		dispatch(showModal(<InventoryInfoPopup data={hero} type={MarketRefType.Hero} />))
	}

	
	const openRemoveFromMarketConfirmPopup = (hero: any) => {
		try {
			dispatch(showModal(
				<RemoveItemFromMarketPopup 
					data={{ refId: hero.id, refType: MarketRefType.Hero }} 
					onCancel={() => dispatch(closeModal())} 
				/>
			));
		} catch (error: any) {
			const msg = error.message || JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
			dispatch(showModal(<ErrorPopup title='Fail to purchase' description={`Error: ${msg}`} />))
		}
	}

	if (loading) return <WindMillLoading />;

	return (
		<div>
			{
				heroInventory.length !== 0 ? (
					<>
						<div className='heroes'>
							{
								heroInventory.map((hero: any) => (
									<div className='hero' key={`hero-${hero.id}`}>
										<div className='hero__image'>
											<Img 
												src={getImageURL(hero.image)}
												alt={hero.name || "hero"} layout='fill'
											/>
										</div>
										<div className='hero__bottom'>
											<h3 className='hero__title'>{hero.name}</h3>
											<div className='hero__type'>
												<Img src={'/images/hero-icon.png'} width={20} height={15} />
												<span>{hero.quality}</span>
											</div>
											{
												hero.isOnMarket ? (
													<>
														<div className='hero__listed-msg'>
															<Img src={'/images/market.png'} width={20} height={20} />
															<span>Listed on market</span>
														</div>
														<button
															className={clsx("button button--danger box__remove")}
															onClick={() => openRemoveFromMarketConfirmPopup(hero)}
														>
															Remove from market
														</button>
													</>
												) : (
													<button 
														className={clsx('button button--secondary hero__listing-btn')}
														onClick={() => handleOpenFillPricePopup(hero)}
													>
														List on market
													</button>
												)
											}
										</div>
										<div className='hero__see-more' onClick={() => handleOpenInfoPopup(hero)}>
											<Img src={'/images/loupe.png'} width={30} height={30} />
										</div>
									</div>
								))
							}
						</div>
					</>
				) : <EmptyMessage />
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
