import { SelectDropdown } from '@/components/common/SelectDropdown';
import { MarketRefType, UserLogAction } from '@/models/index';
import _ from "lodash";
import React from 'react';

interface Props {
	defaultAction: string
	defaultType: string
	onChangeQueries: (obj: any) => void
	resetSearch: () => void
}

const types = Object.keys(MarketRefType).map((type: string) => ({ value: type.toLowerCase(), name: type }));
	
const userActions = 
	Object.values(UserLogAction)
	.map((type: string) => ({ name: _.capitalize(type.toLowerCase().replace(/_/g, " ")), value: type }))
userActions.unshift({ name: "All", value: "" });

const ProfileFilterBar: React.FC<Props> = (props) => {
	const { defaultAction, defaultType, onChangeQueries, resetSearch } = props;

	return (
		<aside className='user-history-filter'>
			<div className='user-history-filter__section user-history-filter__top'>
				<span>FILTER</span>
				<span className='user-history-filter__clear-all' onClick={resetSearch}>Clear all</span>
			</div>
			<div className='user-history-filter__section'>
				<p className='user-history-filter__section-title'>Type</p>
				<SelectDropdown title='type' options={types} selected={defaultType} onChangeSelection={(logType) => onChangeQueries({ logType, page: 1 })} />
			</div>
			<div className='user-history-filter__section'>
				<p className='user-history-filter__section-title'>Action</p>
				<SelectDropdown title='action' options={userActions} selected={defaultAction} onChangeSelection={action => onChangeQueries({ action })} />
			</div>
		</aside>
  	)
}

export default ProfileFilterBar;
