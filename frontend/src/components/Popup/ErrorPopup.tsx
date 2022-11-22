import Img from 'next/image';
import React from 'react';

interface Props {
	title: string
	description: string
	callBack?: () => void
}

const ErrorPopup: React.FC<Props> = ({ title, description, callBack }) => {
	return (
		<div className='error-popup'>
			<Img src='/images/error.png' alt='error' width={50} height={50} />
			<h2 className='message-popup__title'>{title}</h2>
			<p className='message-popup__desc'>{description}</p>
			{
				callBack && <button className='button button--primary message-popup__button' onClick={() => callBack()}>OK</button>
			}
		</div>
  )
};

export default ErrorPopup;