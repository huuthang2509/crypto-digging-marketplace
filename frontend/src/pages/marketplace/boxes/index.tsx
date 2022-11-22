import boxApi from '@/api/box';
import MarketLayout from '@/components/common/Layout/MarketLayout';
import { BoxesTypes } from '@/models/index';
import { getImageURL } from '@/utils/helpers';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Img from 'next/image';
import Link from 'next/link';

interface PageProps {
	boxes: BoxesTypes[]
}

const MarketPlace: NextPage<PageProps> = ({ boxes }) => {
	console.log(boxes)
	return (
		<MarketLayout title="Masterdata Boxes | Crypto Digging Marketplace">
			<div id="marketplace-boxes-page">
				<div className="page-container">
					<div className='boxes'>
						{
							boxes.map((box: BoxesTypes) => (
								<div className='box' key={`box-${box.id}`}>
									<div className='box__image'>
										<Img src={getImageURL(box.img)} alt="box" width={156} height={125} />
									</div>
									<h3 className='box__title'>
										<Link href={`/marketplace/boxes/${box.name}`}>
											<a>{box.name}</a>
										</Link>
									</h3>
									<div className='box__price'>
										<span>Price</span>
										<div className='box__price-right'>
											<Img src={'/images/cdg-icon.svg'} alt="coin" width={30} height={30} />
											<span>{box.CDGPrice}</span>
										</div>
									</div>
								</div>
							))
						}
					</div>
				</div>
			</div>
		</MarketLayout>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	try {
	  const boxes = await boxApi.getBoxes();
  
	  return {
		props: {
		  boxes: boxes.data
		},
		revalidate: 10
	  }
	} catch (error) {
	  return { 
		props: {
		  boxes: []
		},
		revalidate: 10
	  };
	}
}

export default MarketPlace;
