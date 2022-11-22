import React from 'react';

interface Props {
	title: string
	description: string
	callBack?: () => void
}

const SuccessPopup: React.FC<Props> = ({ title, description, callBack }) => {
	return (
		<div className='success-popup'>
			{/* <Img src='/images/success.png' alt='success' width={50} height={50} /> */}
			<div className="success-popup__checkmark-wrapper"> 
				<svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
					<circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/> 
					<path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
				</svg>
			</div>
			<h2 className='success-popup__title'>{title}</h2>
			<p className='success-popup__desc'>{description}</p>
			{
				callBack && <button className='button button--primary message-popup__button' onClick={() => callBack()}>OK</button>
			}
		</div>
  )
};

export default SuccessPopup;