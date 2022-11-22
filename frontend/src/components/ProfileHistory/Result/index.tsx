import WindMillLoading from '@/components/common/Loading/Windmill-Loading';
import Pagination from '@/components/common/Pagination';
import { EmptyMessage } from '@/components/EmptyMessage';
import { MarketRefType, UserLogAction } from '@/models/index';
import { getImageURL } from '@/utils/helpers';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import _ from "lodash";
import Img from 'next/image';
import React from 'react';

interface Props {
	data: any[]
	type: string
	currentPage: number
	totalPage: number
	isLoading: boolean
	onChangeQueries: (obj: any) => void
}

const ProfileHistorySearchResult: React.FC<Props> = ({ data, type, currentPage, totalPage, isLoading, onChangeQueries }) => {
	const renderHistoryTable = () => {
		const tRows: React.ReactNode[] = [];
		if (type === MarketRefType.Box) {
			data.forEach(log => {
				try {
					let item: any = {};
					item = log.data.boxInfoCapture || log.data.itemCapture.boxInfoCapture;
					item && tRows.push(
						<tr key={log.id}>
							<td className='name'>
								<Img 
									src={getImageURL(item.img)}
									alt="box" width={80} height={80}
									/>
								<span>{item.name}</span>
							</td>
							<td>{_.capitalize(log.action.toLowerCase().replace(/_/g, " "))}</td>	
							<td>
								{log.data.CDGPrice && 
									<div className='price'>
										<Img src="/images/cdg-icon.svg" width={25} height={25} />
										{log.data.CDGPrice / LAMPORTS_PER_SOL} CDG
									</div>
								}
								{new Date(log.createdAt).toUTCString()}
							</td>
						</tr>
					)
				} catch (error) {
				}
			});
		}
		else {
			data.forEach(log => {
				try {
					let item: any = {};
					if (log.action === UserLogAction.OpenBox || log.action === UserLogAction.Claim) 
						item = log.data
					else
						item = log.data.itemCapture;
					item && tRows.push(
						<tr key={log.id}>
							<td className='name'>
								<Img 
									src={getImageURL(item.image)}
									alt="hero" width={80} height={80}
								/>
								<span>{item.name}</span>
							</td>
							<td>{_.capitalize(item.quality)}</td>
							<td>{_.capitalize(log.action.toLowerCase().replace(/_/g, " "))}</td>
							<td>
								{log.data.CDGPrice && 
									<div className='price'>
										<Img src="/images/cdg-icon.svg" width={25} height={25} />
										{log.data.CDGPrice / LAMPORTS_PER_SOL} CDG
									</div>
								}
								<p>{new Date(log.createdAt).toUTCString()}</p>
							</td>
						</tr>
					)
				} catch (error) {
				}
			});
		}

		return (
			<table>
				<thead>
					{
						type === MarketRefType.Box ? (
							<tr>
								<th>Item</th>
								<th>Action</th>
								<th>Amount / Time</th>
							</tr>
						) : (
							<tr>
								<th>Item</th>
								<th>Quality</th>
								<th>Action</th>
								<th>Amount / Time</th>
							</tr>
						)
					}
				</thead>
				<tbody>
					{tRows}
				</tbody>
			</table>
		)
	};

	if (isLoading) return (
		<div id='user-history-search-results'>
			<div className='loading'>
				<WindMillLoading large />
			</div>
		</div>
	);
	
	if (data.length === 0) return (
		<div id='user-history-search-results'>
			<div className='message'>
				<EmptyMessage title="No history up till now" />
			</div>
		</div>
	);
	
	return (
		<div id='user-history-search-results'>
			<div className='user-history__wrapper'>
				{renderHistoryTable()}
				<div className='pagination'>
					<Pagination currentPage={currentPage} totalPage={totalPage} setPage={page => onChangeQueries({ page })} />
				</div>
			</div>
		</div>
  	)
}

export default ProfileHistorySearchResult;