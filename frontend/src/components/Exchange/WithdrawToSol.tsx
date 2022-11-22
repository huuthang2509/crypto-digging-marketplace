import userApi from '@/api/user';
import LoadingButton from '@/components/common/Button/LoadingButton';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import SuccessPopup from '@/components/Popup/SuccessPopup';
import { ActionTypes } from '@/models/index';
import { showModal } from '@/redux/slices/modal';
import { useAppDispatch } from '@/redux/store';
import { CDGExchange } from '@/utils/constants';
import { getTransactionTransferSplToken } from '@/utils/transaction';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Img from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface IAmountForm {
	amount: number
}

const WithdrawToSOL: React.FC = () => {
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
	
			const CDGAmount = +data.amount;
			const transaction = await getTransactionTransferSplToken(
				connection,
				publicKey,
				process.env.NEXT_PUBLIC_CGD_TOKEN || '7ctmggF48CzBq6L6JvmcM5KrjfRm4zMir1ycVoFfkd31',
				CDGAmount
			);
			const signatureCharge = await sendTransaction(transaction, connection);
			const sign = await connection.confirmTransaction(signatureCharge, 'processed');
			if (!sign) throw new Error();
			
			const signatureResponse: any = await userApi.getSignature(ActionTypes.Payment);
			await userApi.withdraw(CDGAmount * CDGExchange, signatureResponse.signature);
			dispatch(showModal(<SuccessPopup title='Withdraw Successfully' description={"Check your wallet now"} />))
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
				<Img src={'/images/cdg.png'} alt="CDG" width={100} height={100} />
				<Img src={'/images/right-arrow.png'} alt="withdraw" width={50} height={50} />
				<Img src={'/images/solana.png'} alt="solana" width={100} height={100} />
 			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group">
					<label>CDG amount</label>
					<input type="number" {...register('amount', {required: "Amount is required"})} />
					{errors.amount && <p className="form-error">{errors.amount.message}</p>}
				</div>
				<LoadingButton type='submit' title='Withdraw' className='button button--primary' isLoading={transacting} />
			</form>
		</>
	)
}

export default WithdrawToSOL;