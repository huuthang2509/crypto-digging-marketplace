import Img from 'next/image';
import React from 'react';

export const EmptyMessage: React.FC<{ title?: string }> = ({ title }) => {
  return (
	<div className='empty-message'>
		<Img src={'/images/box-empty.png'} alt="empty" width={100} height={100} />
		<p className='empty-message__title'>{title || "You do not have any items"}</p>
	</div>
  )
}
