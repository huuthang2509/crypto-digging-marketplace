import { closeModal } from '@/redux/slices/modal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import clsx from 'clsx';
import Img from 'next/image';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Modal: React.FC = () => {
  const [isBrowser, setIsBrowser] = useState(false);
  const { show, component } = useAppSelector((state) => state.popup);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(closeModal());
  };

  const modalContent = (
    <div className={clsx('app-modal', { 'app-modal--show': show })}>
      <div className="app-modal__dialog">
        <div className="app-modal__close" onClick={handleCloseClick}>
          <Img src={'/images/close.svg'} alt="close" width={20} height={20} />
        </div>
        <div className="app-modal__content">{component}</div>
      </div>
    </div>
  );

  if (isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root')!);
  } else {
    return null;
  }
};

export default Modal;
