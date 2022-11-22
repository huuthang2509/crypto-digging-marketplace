import { MarketRefType } from '@/models/index';
import Img from 'next/image';
import React from 'react';

interface Props {
	data: any
	type: MarketRefType
}

const InventoryInfoPopup: React.FC<Props> = ({ data, type }) => {
	return (
		<div className='item-inventory-popup'>
			<div className='item-inventory-popup__image'>
				<Img 
					src={type === MarketRefType.Hero 
						? `${process.env.NEXT_PUBLIC_IMAGE_STORAGE}${data.image}`
						: `${process.env.NEXT_PUBLIC_IMAGE_STORAGE}${data.boxInfoCapture.img}`
					} 
					alt={"item"} layout='fill' objectFit='contain'
				/>
			</div>
			<div className='item-inventory-popup__info'>
				<h2 className='item__name'>{type === MarketRefType.Hero ? data.name : data.boxInfoCapture.name}</h2>
				{
					type === MarketRefType.Hero && (
						<>
							<div className='item__type'>
								<Img src={'/images/hero-icon.png'} width={30} height={30} />
								<span>{data.quality}</span>
							</div>
							<p className='item__description'>{data.description}</p>
						</>
					)
				}
				{
					type === MarketRefType.Hero ? (
						<div className='hero__specifications'>
							<div className='hero__specification'>
								<Img src={'/images/darts.png'} alt="box" width={25} height={25} />
								<div className='hero__specification-right'>
									<p className='hero__specification-number'>{data.statistic?.animationSpeed}</p>
									{" "}
									<p className='hero__specification-text'>Animation speed</p>
								</div>
							</div>
							<div className='hero__specification'>
								<Img src={'/images/acceleration.png'} alt="box" width={25} height={25} />
								<div className='hero__specification-right'>
									<p className='hero__specification-number'>{data.statistic?.moveSpeed}</p>
									{" "}
									<p className='hero__specification-text'>Move speed</p>
								</div>
							</div>
							<div className='hero__specification'>
								<Img src={'/images/health.png'} alt="box" width={25} height={25} />
								<div className='hero__specification-right'>
									<p className='hero__specification-number'>{data.statistic?.stamina}</p>
									{" "}
									<p className='hero__specification-text'>Stamina</p>
								</div>
							</div>
							<div className='hero__specification'>
								<Img src={'/images/gem.svg'} alt="box" width={25} height={25} />
								<div className='hero__specification-right'>
									<p className='hero__specification-number'>{data.statistic?.gemEarn}</p>
									{" "}
									<p className='hero__specification-text'>Gem earn</p>
								</div>
							</div>
						</div>
					) : (
						<div className='box__specifications'>
							<div className='box__specification'>
								<p className='box__specification-number'>{data.boxInfoCapture.commonRatio}</p>
								<p className='box__specification-text'>Common ratio</p>
							</div>
							<div className='box__specification'>
								<p className='box__specification-number'>{data.boxInfoCapture.epicRatio}</p>
								<p className='box__specification-text'>Epic ratio</p>
							</div>
							<div className='box__specification'>
								<p className='box__specification-number'>{data.boxInfoCapture.legendRatio}</p>
								<p className='box__specification-text'>Legend ratio</p>
							</div>
							<div className='box__specification'>
								<p className='box__specification-number'>{data.boxInfoCapture.rareRatio}</p>
								<p className='box__specification-text'>Rare ratio</p>
							</div>
						</div>
					)
				}
			</div>
		</div>
  	)
};

export default InventoryInfoPopup;