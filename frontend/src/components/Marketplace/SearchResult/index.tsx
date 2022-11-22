import WindMillLoading from '@/components/common/Loading/Windmill-Loading';
import Pagination from '@/components/common/Pagination';
import { EmptyMessage } from '@/components/EmptyMessage';
import { MarketRefType } from '@/models/index';
import { checkItemBelongsToOwner, getImageURL } from '@/utils/helpers';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Img from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
	data: any[]
	currentPage: number
	totalPage: number
	isLoading: boolean
	onChangeQueries: (obj: any) => void
}

export const MarketplaceSearchResult: React.FC<Props> = ({ data, currentPage, totalPage, isLoading, onChangeQueries }) => {
	if (isLoading) return (
		<div id='marketplace-search-results'>
			<div className='loading'>
				<WindMillLoading large />
			</div>
		</div>
	);
	
	if (data.length === 0) return (
		<div id='marketplace-search-results'>
			<div className='message'>
				<EmptyMessage title="No items found" />
			</div>
		</div>
	);
	
	return (
		<div id='marketplace-search-results'>
			<div className='nfts'>
				{
					data.map((item: any) => {
						return (
							<Link key={`${item.id}`} href={`/marketplace/${item.refType}/${item.id}`}>
								<a>
									<div className='nft' key={item.id}>
										<div className='nft__image'>
											{
												item.refType === MarketRefType.Hero 
												? <Img src={getImageURL(item.itemCapture.image)} alt="item" layout='fill' />
												: <Img src={getImageURL(item.itemCapture.boxInfo.img)} alt="item" layout='fill' />
											}
										</div>
										{
											checkItemBelongsToOwner(item.ownerId) && (
												<div className='nft__owner'>
													<Img src={'/images/avatar-man.png'} alt="owner" width={20} height={20} />
												</div>
											)
										}
										<div className='nft__info'>
											<p className='nft__title'>
												{
													item.refType === MarketRefType.Hero 
													? item.itemCapture.name
													: item.itemCapture.boxInfo.name
												}
											</p>
											{
												item.refType === MarketRefType.Hero && (
													<div className='nft__type'>
														<span>Type</span>
														<div>
															<Img src={'/images/hero-icon.png'} width={20} height={20} />
															<span>{item.itemCapture.quality}</span>
														</div>
													</div>
												)
											}
											<div className="nft__price">
												<span>Price</span>
												<div className='nft__price-right'>
													<Img src="/images/cdg-icon.svg" alt="game" width={22} height={22} />
													<span>{item.CDGPrice / LAMPORTS_PER_SOL }</span>
												</div>
											</div>
										</div>
									</div>
								</a>
							</Link>
						)
					})
				}
			</div>
			<div className='pagination'>
				<Pagination currentPage={currentPage} totalPage={totalPage} setPage={page => onChangeQueries({ page })} />
			</div>
		</div>
  	)
}
