import React from 'react'

interface Props {
	title: string
	options: { name: string, value: string | number }[]
	selected?: string | number
	onChangeSelection: (value: string) => void
}

export const SelectDropdown: React.FC<Props> = (props) => {
	const { title, options, selected = "", onChangeSelection } = props;

	const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChangeSelection(e.target.value);
	};
	
	return (
		<select onChange={onChange} value={selected}>
			{options.map(option => {
				return (
					<option key={`${title}-${option.value}`} value={option.value}>
						{option.name}
					</option>
				)
			})}
		</select>
	)
}
