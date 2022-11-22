import _ from "lodash";
import React, { useCallback, useState } from 'react';

interface Props {
	currentPage: number
	totalPage: number
	setPage: (page: number) => void
}

const Pagination: React.FC<Props> = (props) => {
	const { currentPage, totalPage, setPage } = props;

	const [value, setValue] = useState<number>(currentPage);

	const debounceSetPage = useCallback(
		_.debounce((value) => setPage(value), 500), []
	);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = +e.target.value;
		if (input <= 0) {
			setValue(1);
			debounceSetPage(1);
			return;
		}
		if (input > totalPage) {
			setValue(totalPage);
			debounceSetPage(totalPage);
			return;
		}
		setValue(input);
		debounceSetPage(input);
	};

	const onClickPrev = () => {
		if (value <= 1) return;
		setValue(prev => prev - 1);
		debounceSetPage(value - 1);
	};

	const onClickNext = () => {
		if (value >= totalPage) return;
		setValue(prev => prev + 1);
		debounceSetPage(value + 1);
	};
	
	return (
		<div className='custom-pagination'>
			<button className="button" onClick={onClickPrev}>{'<'}</button>
			<div className='custom-pagination__input-div'>
				{totalPage !== 0 && <input type={'number'} value={value} onChange={onChange} />}
				<span>of {totalPage}</span>
			</div>
			<button className="button" onClick={onClickNext}>{'>'}</button>
		</div>
	)
}

export default Pagination;
