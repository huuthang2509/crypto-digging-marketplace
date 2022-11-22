import WindMillLoading from '@/components/common/Loading/Windmill-Loading';
import Img from 'next/image';
import React, { useEffect, useState } from 'react';

interface Props {
	data: any
}

const OpenBoxSuccessPopup: React.FC<Props> = ({ data }) => {
	const [showLoading, setShowLoading] = useState<boolean>(true);

	useEffect(() => {
		const showLoadingTimeout = setTimeout(() => {
			setShowLoading(false);
		}, 1000);

		return () => { clearTimeout(showLoadingTimeout); };
	}, []);

	return (
		<div className='open-box-success-popup'>
			{
				showLoading ? (
					<div className='open-box-success-popup__loading'>
						<WindMillLoading />
					</div>
				) : (
					<>
						<div className='open-box-success-popup__image'>
							<Img 
								src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE}${data.image}`} 
								alt={data.name || "hero"} layout='fill' objectFit='contain'
							/>
						</div>
						<div className='open-box-success-popup__info'>
							<div className='unlocked'>
								<Img src='/images/success.png' alt="success" width={20} height={20} />
								<span>Unlocked</span>
							</div>
							<h2 className='hero__name'>{data.name}</h2>
							<div className='hero__type'>
								<p>{data.quality}</p>
							</div>
							<p className='hero__description'>{data.description}</p>
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
						</div>
					</>
				)
			}
		</div>
  )
};

export default OpenBoxSuccessPopup;