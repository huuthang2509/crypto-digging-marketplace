import userApi from '@/api/user';
import LoadingButton from '@/components/common/Button/LoadingButton';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import SuccessPopup from '@/components/Popup/SuccessPopup';
import { ActionTypes } from '@/models/index';
import { showModal } from '@/redux/slices/modal';
import { useAppDispatch } from '@/redux/store';
import { solExchange } from '@/utils/constants';
import { getTransactionTransferCurrency } from '@/utils/transaction';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Img from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface IAmountForm {
	amount: number
}

const SolToCDGTab: React.FC = () => {
	const { publicKey, sendTransaction } = useWallet();
	const { connection } = useConnection();
	const dispatch = useAppDispatch();
	const [transacting, setTransacting] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IAmountForm>();

	const onSubmit = async (data: IAmountForm) => {
		try {
			setTransacting(true);
			if (!publicKey) throw new WalletNotConnectedError("Wallet not connected");
	
			const solAmount = +data.amount;
			const transaction = getTransactionTransferCurrency(solAmount, publicKey);
			const signatureCharge = await sendTransaction(transaction, connection);
	
			const sign = await connection.confirmTransaction(signatureCharge, 'processed');
			if (!sign) throw new Error();
			
			const signatureResponse: any = await userApi.getSignature(ActionTypes.Payment);
			await userApi.transferCDGToken(solAmount * solExchange, signatureResponse.signature);
			dispatch(showModal(<SuccessPopup title='Exchange to CDG successfully' description={"Check your wallet now"} />))
		} catch (error: any) {
			const errorMsg = error.message;
      		dispatch(showModal(<ErrorPopup title='Error' description={errorMsg} />))
		} finally {
			setTransacting(false);
		}
	}
	
	return (
		<>
			<div className='images'>
				<Img src={'/images/solana.png'} alt="solana" width={100} height={100} />
				<Img src={'/images/right-arrow.png'} alt="convert-to" width={50} height={50} />
				<Img src={'/images/cdg.png'} alt="CDG" width={100} height={100} />
 			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group">
					<label>Solana amount</label>
					<input type="number" step="0.001" {...register('amount', {required: "Amount is required"})} />
					{errors.amount && <p className="form-error">{errors.amount.message}</p>}
				</div>
				<LoadingButton type='submit' title='Exchange' className='button button--primary' isLoading={transacting} />
			</form>
		</>
	)
}

export default SolToCDGTab;