import React from 'react';

interface Props {
	title: string
	description: string
	callBack?: () => void
}

const MessagePopup: React.FC<Props> = ({ title, description, callBack }) => {
	return (
		<div className='message-popup'>
			<h2 className='message-popup__title'>{title}</h2>
			<p className='message-popup__desc'>{description}</p>
			{
				callBack && <button className='button button--primary message-popup__button' onClick={() => callBack()}>OK</button>
			}
		</div>
  )
};

export default MessagePopup;