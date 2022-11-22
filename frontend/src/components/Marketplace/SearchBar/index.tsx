import { CheckboxCriteria } from '@/components/common/CheckboxCriteria';
import MinMaxCriteria from '@/components/common/MinMaxCriteria/MinMaxCriteria';
import { SelectDropdown } from '@/components/common/SelectDropdown';
import { HeroBoxesType, MarketRefType } from '@/models/index';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import React from 'react';

interface Props {
	defaultRarities: string[]
	defaultPriceRange: Array<number | undefined>
	defaultSort: string
	defaultType: string
	onChangeQueries: (obj: any) => void
	resetSearch: () => void
}

export const MarketplaceSearchBar: React.FC<Props> = (props) => {
	const { defaultRarities, defaultPriceRange, defaultSort, defaultType, onChangeQueries, resetSearch } = props;
	
	const rarities = Object.keys(HeroBoxesType).map((type: string) => ({ id: type.toLowerCase(), name: type }));
	const sortOptions = [
		{ name: 'Lastest', value: '[["createdAt", "DESC"]]'},
		{ name: 'Cheapest Item', value: '[["CDGPrice", "ASC"]]'},
		{ name: 'Most Expensive', value: '[["CDGPrice", "DESC"]]'}
	];
	const types = Object.keys(MarketRefType).map((type: string) => ({ value: type.toLowerCase(), name: type }));

	return (
		<aside className='marketplace-filter'>
			<div className='marketplace-filter__section marketplace-filter__top'>
				<span>FILTER</span>
				<span className='marketplace-filter__clear-all' onClick={resetSearch}>Clear all</span>
			</div>
			<div className='marketplace-filter__section'>
				<p className='marketplace-filter__section-title'>Type</p>
				<SelectDropdown title='type' options={types} selected={defaultType} onChangeSelection={(type) => onChangeQueries({ type, page: 1 })} />
			</div>
			<div className='marketplace-filter__section'>
				<p className='marketplace-filter__section-title'>Rarity</p>
				<CheckboxCriteria title='rarities' 
					values={rarities} 
					selectedValues={defaultRarities} 
					setSelectedValue={(e) => onChangeQueries({ quality: e.join() })} 
				/>
			</div>
			<div className='marketplace-filter__section'>
				<p className='marketplace-filter__section-title'>Sort by</p>
				<SelectDropdown title='sort-by' options={sortOptions} selected={defaultSort} onChangeSelection={(e) => onChangeQueries({ sort: e })} />
			</div>
			<div className='marketplace-filter__section'>
				<p className='marketplace-filter__section-title'>Price Range</p>
				<MinMaxCriteria 
					title='price-range'
					minDefaultValue={defaultPriceRange[0]}
					maxDefaultValue={defaultPriceRange[1]}
					setMin={e => onChangeQueries({ priceFrom: e * LAMPORTS_PER_SOL })} 
					setMax={e => onChangeQueries({ priceTo: e * LAMPORTS_PER_SOL })} 
				/>
			</div>
		</aside>
  	)
}
