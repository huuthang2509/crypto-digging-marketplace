import userApi from '@/api/user';
import LoadingButton from '@/components/common/Button/LoadingButton';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import { ActionTypes, MarketRefType } from '@/models/index';
import { closeModal, showModal } from '@/redux/slices/modal';
import { getMyBoxInventory, getMyHeroInventory } from '@/redux/slices/user';
import { useAppDispatch } from '@/redux/store';
import { PATH } from '@/utils/constants';
import { chargeFee, getTransactionTransferCurrency } from '@/utils/transaction';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import MessagePopup from './MessagePopup';

interface Props {
	data: any
	onCancel: () => void
}

const RemoveItemFromMarketPopup: React.FC<Props> = ({ data, onCancel }) => {
	const dispatch = useAppDispatch();
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
	const router = useRouter();

	const [deleting, setDeleting] = useState<boolean>(false);

	const handleDeleteItem = async () => {
		try {
			if (!publicKey) throw new WalletNotConnectedError("Wallet not connected");
			setDeleting(true);

			const transaction = getTransactionTransferCurrency(chargeFee, publicKey);
			const signature = await sendTransaction(transaction, connection);
			await connection.confirmTransaction(signature, 'processed');

			const signatureResponse: any = await userApi.getSignature(ActionTypes.Remove);
			await userApi.removeItemFromMarket(data.refId, data.refType as MarketRefType, signatureResponse.signature);
			
			dispatch(showModal(
				<MessagePopup 
					title='Remove item successfully' 
					description={"Item removed from marketplace!"} 
					callBack={() => {
						dispatch(closeModal());
						if (router.pathname.startsWith(PATH.marketplace))
							router.replace(PATH.marketplace);
						else {
							dispatch(getMyBoxInventory());
							dispatch(getMyHeroInventory());
						};
					}}
				/>
			));
		} catch (error: any) {
			const msg = error.message || JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
			dispatch(showModal(<ErrorPopup title='Fail to remove from marketplace' description={`Error: ${msg}`} />))
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className='remove-item-popup'>
			<h2 className='remove-item-popup__title'>Remove item from marketplace</h2>
			<div className='remove-item-popup__submit-btn'>
				<LoadingButton title='Remove' isLoading={deleting} onClick={handleDeleteItem} />
			</div>
		</div>
	);
};

export default RemoveItemFromMarketPopup;
