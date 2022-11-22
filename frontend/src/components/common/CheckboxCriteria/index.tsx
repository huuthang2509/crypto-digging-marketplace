import React from 'react';

interface Props {
	title: string
	values: {id: string | number, name: string}[]
	selectedValues: string[]
	setSelectedValue: (newValue: any) => void
}

export const CheckboxCriteria: React.FC<Props> = ({ title, values, selectedValues, setSelectedValue }) => {
	const handleChange = (e: any) => {
		const id = e.target.value;
		const name = e.target.getAttribute("name");
		let _selectedValues = [...selectedValues];
		const indexOfSelectedItem = _selectedValues.findIndex((item) => item === id);
		if (indexOfSelectedItem === -1) {
			_selectedValues.push(id);
		} else {
			_selectedValues.splice(indexOfSelectedItem, 1);
		}
		setSelectedValue(_selectedValues);
	};

	const isChecked = (id: string) => {
		return selectedValues.findIndex(value => value === id) === -1 ? false : true;
	}

	return (
		<div className="checkbox-criteria__wrap">
			<ul className="checkbox-criteria__list">
				{values.map((value: any) => (
					<li className="checkbox-criteria__item" key={value.id}>
						<input
							type="checkbox"
							id={`${title}-${value.id}`}
							name={value.name}
							value={value.id}
							checked={isChecked(value.id)}
							onChange={(e) => handleChange(e)}
						/>
						<label
							htmlFor={`${title}-${value.id}`}
							role="button"
						>
							{value.name}
						</label>
					</li>
				))}
			</ul>
		</div>
	)
}
