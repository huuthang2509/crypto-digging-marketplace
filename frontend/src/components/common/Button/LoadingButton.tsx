import WindMillLoading from '@/components/common/Loading/Windmill-Loading';
import clsx from 'clsx';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	title: string
	isLoading: boolean
}

const LoadingButton: React.FC<Props> = (props) => {
	const { title, isLoading, className, onClick, ...buttonProps } = props;

	return (
		<button
			className={clsx('button button--primary', className, 'loading-btn', { 'button--disabled': isLoading })} 
			disabled={isLoading}
			onClick={isLoading ? () => {} : onClick}
			{...buttonProps}
		>
			{
				isLoading ? <WindMillLoading /> : null
			}
			<span>{title}</span>
		</button>
	)
}

export default LoadingButton