import { CheckboxCriteria } from '@/components/common/CheckboxCriteria';
import { SelectDropdown } from '@/components/common/SelectDropdown';
import { HeroBoxesType, MarketRefType } from '@/models/index';
import { debounce } from "lodash";
import Img from 'next/image';
import React, { useCallback, useEffect } from 'react';

interface Props {
	defaultType: MarketRefType
	defaultRarities: string[]
	defaultSearch: {
		[MarketRefType.Box]: string
		[MarketRefType.Hero]: string
	}
	onChangeType: (type: MarketRefType) => void
	onChangeSearch: (obj: any) => void
	resetSearch: () => void
}

const InventorySearchBar: React.FC<Props> = (props) => {
	const { 
		defaultType, defaultRarities, defaultSearch, 
		onChangeType, onChangeSearch, resetSearch 
	} = props;

	useEffect(() => {
		const searchInput = document.getElementById("inventory-search") as HTMLInputElement;
		searchInput.value = defaultSearch[defaultType];
	}, [defaultSearch]);
	
	const rarities = Object.keys(HeroBoxesType).map((type: string) => ({ id: type.toLowerCase(), name: type }));
	const types = Object.keys(MarketRefType).map((type: string) => ({ value: type.toLowerCase(), name: type }));

	const debounceSearchKeyword = useCallback(
		debounce((value) => {
			onChangeSearch({ search: value })
		}, 1000),
		[defaultType]
	);
	const onChangeSearchKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		debounceSearchKeyword(value);
	};

	return (
		<aside className='inventory-filter'>
			<div className='inventory-filter__section inventory-filter__top'>
				<Img src={'/images/box-icon.png'} alt="box" width={22} height={22} />
				<span>MY INVENTORY</span>
			</div>
			<div className='inventory-filter__section'>
				<p className='inventory-filter__section-title'>Type</p>
				<SelectDropdown 
					title='type' 
					options={types} 
					selected={defaultType} 
					onChangeSelection={(type) => onChangeType(type as MarketRefType)} 
				/>
			</div>
			<div className='inventory-filter__section'>
				<p className='inventory-filter__section-title'>Search</p>
				<input
					id="inventory-search"
					defaultValue={defaultSearch[MarketRefType.Box]}
					placeholder="Type something"
					onChange={(e) => onChangeSearchKeyword(e)}
				/>
			</div>
			<div className='inventory-filter__section'>
				<p className='inventory-filter__section-title'>Rarity</p>
				<CheckboxCriteria title='rarities' 
					values={rarities} 
					selectedValues={defaultRarities} 
					setSelectedValue={values => onChangeSearch({ quality: values })}
				/>
			</div>
		</aside>
  	)
}

export default InventorySearchBar;
