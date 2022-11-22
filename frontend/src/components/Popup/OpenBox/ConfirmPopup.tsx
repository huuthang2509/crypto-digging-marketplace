import boxApi from '@/api/box';
import userApi from '@/api/user';
import LoadingButton from '@/components/common/Button/LoadingButton';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import { ActionTypes } from '@/models/index';
import { showModal } from '@/redux/slices/modal';
import { getMyBoxInventory, getMyHeroInventory } from '@/redux/slices/user';
import { useAppDispatch } from '@/redux/store';
import { chargeFee, getTransactionTransferCurrency } from '@/utils/transaction';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';
import OpenBoxSuccessPopup from './OpenBoxSuccess';

interface Props {
	boxId: any
}

const OpenBoxConfirmationPopup: React.FC<Props> = ({ boxId }) => {
	const [opening, setOpening] = useState<boolean>(false);
	const dispatch = useAppDispatch();
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

	const handleOpeningBox = async () => {
		try {
			if (!publicKey) throw new WalletNotConnectedError("Wallet not connected");
			setOpening(true);

			const transaction = getTransactionTransferCurrency(chargeFee, publicKey);
			const signature = await sendTransaction(transaction, connection);
			await connection.confirmTransaction(signature, 'processed');

			const signatureResponse: any = await userApi.getSignature(ActionTypes.OpenBox);
			const res = await boxApi.openBox(boxId, signatureResponse.signature);

			dispatch(getMyBoxInventory());
			dispatch(getMyHeroInventory());
			dispatch(showModal(<OpenBoxSuccessPopup data={res.data} />));
			setOpening(false);
		} catch (error: any) {
			const errorMsg = error.message;
		  	dispatch(showModal(<ErrorPopup title='Error opening box' description={errorMsg} />))
		}
	}

	return (
		<div className='open-box-confirmation-popup'>
			<h2 className='open-box-confirmation-popup__title'>You are about to open box</h2>
			<div className='open-box-confirmation-popup__submit-btn'>
				<LoadingButton title='Open' isLoading={opening} onClick={handleOpeningBox} />
			</div>
		</div>
  )
};

export default OpenBoxConfirmationPopup;