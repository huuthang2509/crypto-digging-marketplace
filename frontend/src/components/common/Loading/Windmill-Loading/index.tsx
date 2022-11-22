import clsx from 'clsx';
import React from 'react';

const WindMillLoading: React.FC<{ large?: boolean }> = ({ large }) => {
  return (
	<div className='windmill-loading'>
  		<div className={clsx('windmill-dot', { 'windmill-dot--large': large })}></div>
	</div>
  )
}

export default WindMillLoading