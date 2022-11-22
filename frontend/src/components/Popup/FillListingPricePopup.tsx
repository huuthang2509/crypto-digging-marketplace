import userApi from '@/api/user';
import LoadingButton from '@/components/common/Button/LoadingButton';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import SuccessPopup from '@/components/Popup/SuccessPopup';
import { ActionTypes, MarketRefType } from '@/models/index';
import { showModal } from '@/redux/slices/modal';
import { getMyBoxInventory, getMyHeroInventory } from '@/redux/slices/user';
import { useAppDispatch } from '@/redux/store';
import { chargeFee, getTransactionTransferCurrency, getTransactionTransferSplToken } from '@/utils/transaction';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface IPriceForm {
	price: number
}

interface Props {
	defaultPrice?: number
	item: any
	type: MarketRefType
}

const FillListingPricePopup: React.FC<Props> = ({ defaultPrice, item, type }) => {
	const [errorMsg, setErrorMsg] = useState("");
	const dispatch = useAppDispatch();
	const [isPushingToMarket, setPushingToMarket] = useState<boolean>(false);
    const { publicKey, sendTransaction, signTransaction } = useWallet();
    const { connection } = useConnection();
	
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IPriceForm>();

	const onSubmit = async (data: IPriceForm) => {
		try {
			if (!publicKey) throw new WalletNotConnectedError("Wallet not connected");

			const { price } = data;
			setPushingToMarket(true);
			
			const transaction = getTransactionTransferCurrency(chargeFee, publicKey);
			const signature = await sendTransaction(transaction, connection);
			await connection.confirmTransaction(signature, 'processed');

			const tranferSplTokenTransaction = await getTransactionTransferSplToken(
				connection, 
				publicKey, 
				item.tokenId, 
				1, 
				Keypair.fromSecretKey(
					new Uint8Array((process.env.NEXT_PUBLIC_SOL_PRIVATE_KEYPAIR || '').split(",").map((e) => +e)),
				).publicKey.toBase58()
			);
			if (!signTransaction) throw new Error("Unknown error");
			const signed = await signTransaction(tranferSplTokenTransaction);
			const signature2 = await connection.sendRawTransaction(signed.serialize())
			await connection.confirmTransaction(signature2);

			const signatureResponse: any = await userApi.getSignature(ActionTypes.SendToMarket);
			await userApi.pushToMarket(item.id, type, price * LAMPORTS_PER_SOL, signatureResponse.signature);
			type === MarketRefType.Box ? dispatch(getMyBoxInventory()) : dispatch(getMyHeroInventory());
			dispatch(showModal(<SuccessPopup title='Complete!' description={"Listing on market successfully!"} />))
		} catch (error: any) {
			console.log(error.message);
			const msg = error.message || JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
			setErrorMsg(msg);
			dispatch(showModal(<ErrorPopup title='Fail to listing on market' description={`Error: ${msg}`} />))
		} finally {
			setPushingToMarket(false);
		}
	};

	return (
		<form className="fill-price-listing" onSubmit={handleSubmit(onSubmit)}>
			<h2 className='fill-price-listing__title'>Fill expected listing price</h2>
			{
				errorMsg && <p className="form-error">{errorMsg}</p>
			}
			<div className="form-group">
				<label>Expected price</label>
				<input type="number" defaultValue={defaultPrice} {...register('price', {required: "Price is required"})} />
				{errors.price && <p className="form-error">{errors.price.message}</p>}
			</div>
			<LoadingButton type='submit' title='Push to market' className='button button--primary fill-price-listing__submit-btn' isLoading={isPushingToMarket} />
		</form>
  )
};

export default FillListingPricePopup;