import marketplaceAPI from '@/api/marketplace';
import userApi from '@/api/user';
import LoadingButton from '@/components/common/Button/LoadingButton';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import SuccessPopup from '@/components/Popup/SuccessPopup';
import { ActionTypes, MarketRefType } from '@/models/index';
import { showModal } from '@/redux/slices/modal';
import { useAppDispatch } from '@/redux/store';
import { chargeFee, getTransactionTransferCurrency, getTransactionTransferSplToken } from '@/utils/transaction';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState } from 'react';

interface Props {
	userInfo: any
	data: any
	onCancel: () => void
}

const MarketItemPurchaseCheckout: React.FC<Props> = ({ userInfo, data, onCancel }) => {
	const dispatch = useAppDispatch();
    const { publicKey, sendTransaction, signTransaction } = useWallet();
    const { connection } = useConnection();

	const [isPurchasing, setPurchasing] = useState<boolean>(false);
	const handlePurchaseItem = async () => {
		try {
			if (!publicKey) throw new WalletNotConnectedError("Wallet not connected");

			setPurchasing(true);

			const transaction = getTransactionTransferCurrency(chargeFee, publicKey);
			const signature = await sendTransaction(transaction, connection);
			await connection.confirmTransaction(signature, 'processed');

			const tranferSplTokenTransaction = await getTransactionTransferSplToken(
				connection, 
				publicKey, 
				process.env.NEXT_PUBLIC_CGD_TOKEN || '', 
				data.CDGPrice / LAMPORTS_PER_SOL, 
				Keypair.fromSecretKey(
					new Uint8Array((process.env.NEXT_PUBLIC_SOL_PRIVATE_KEYPAIR || '').split(",").map((e) => +e)),
				).publicKey.toBase58()
			);
			if (!signTransaction) throw new Error("Unknown error");
			const signed = await signTransaction(tranferSplTokenTransaction);
			const signature2 = await connection.sendRawTransaction(signed.serialize())
			await connection.confirmTransaction(signature2);

			const signatureResponse: any = await userApi.getSignature(ActionTypes.Purchase);
			await marketplaceAPI.purchase(data.refId, data.refType as MarketRefType, signatureResponse.signature);
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
			<div className='row-info price'>
				<span>Price</span>
				<span>{data.CDGPrice / LAMPORTS_PER_SOL} CDG</span>
			</div>
			<div className='buttons'>
				<LoadingButton title='Purchase' className='submit-btn' isLoading={isPurchasing} onClick={handlePurchaseItem} />
				<button className='button cancel-btn' onClick={onCancel}>Cancel</button>
			</div>
		</div>
	);
};

export default MarketItemPurchaseCheckout;
