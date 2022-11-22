import boxApi from '@/api/box';
import userApi from '@/api/user';
import LoadingButton from '@/components/common/Button/LoadingButton';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import SuccessPopup from '@/components/Popup/SuccessPopup';
import { ActionTypes, BoxesTypes } from '@/models/index';
import { showModal } from '@/redux/slices/modal';
import { useAppDispatch } from '@/redux/store';
import { chargeFee, getTransactionTransferCurrency, getTransactionTransferSplToken } from '@/utils/transaction';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';
import { useState } from 'react';

interface Props {
	userInfo: any
	quantity: number
	data: BoxesTypes
	onCancel: () => void
}

const BoxPurchaseCheckout: React.FC<Props> = ({ userInfo, quantity, data, onCancel }) => {
	const dispatch = useAppDispatch();
    const { publicKey, signTransaction, sendTransaction } = useWallet();
    const { connection, } = useConnection();

	const [isPurchasing, setPurchasing] = useState<boolean>(false);
	const handlePurchaseBox = async () => {
		try {
			if (!publicKey) throw new WalletNotConnectedError("Wallet not connected");

			setPurchasing(true);
			const transaction = getTransactionTransferCurrency(quantity * chargeFee, publicKey);
			const signature = await sendTransaction(transaction, connection);
			await connection.confirmTransaction(signature, 'processed');

			const tranferSplTokenTransaction = await getTransactionTransferSplToken(
				connection, 
				publicKey, 
				process.env.NEXT_PUBLIC_CGD_TOKEN || '', 
				quantity * data.CDGPrice, 
				Keypair.fromSecretKey(
					new Uint8Array((process.env.NEXT_PUBLIC_SOL_PRIVATE_KEYPAIR || '').split(",").map((e) => +e)),
				).publicKey.toBase58()
			);
			if (!signTransaction) throw new Error("Unknown error");
			const signed = await signTransaction(tranferSplTokenTransaction);
			const signature2 = await connection.sendRawTransaction(signed.serialize())
			await connection.confirmTransaction(signature2);

			const signatureResponse: any = await userApi.getSignature(ActionTypes.Purchase);
			await boxApi.purchaseBoxes(quantity, data.id, signatureResponse.signature);
			dispatch(showModal(<SuccessPopup title='Complete!' description={"Purchase successfully. Check your inventory!"} />))
		} catch (error: any) {
			const msg = error.message || JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
			dispatch(showModal(<ErrorPopup title='Fail to purchase' description={`Error: ${msg}`} />))
		} finally {
			setPurchasing(false);
		}
	}

	return (
		<div className='box-checkout-popup'>
			<h2 className='title'>Checkout</h2>
			<div className='row-info'>
				<span>Price</span>
				<span>{data.CDGPrice} CDG</span>
			</div>
			<div className='row-info'>
				<span>Amount</span>
				<span>{quantity}</span>
			</div>
			<div className='row-info price'>
				<span>Total Price</span>
				<span>{quantity * data.CDGPrice} CDG</span>
			</div>
			<div className='buttons'>
				<LoadingButton title='Purchase' className='submit-btn' isLoading={isPurchasing} onClick={handlePurchaseBox} />
				<button className='button cancel-btn' onClick={onCancel}>Cancel</button>
			</div>
		</div>
	);
};

export default BoxPurchaseCheckout;
