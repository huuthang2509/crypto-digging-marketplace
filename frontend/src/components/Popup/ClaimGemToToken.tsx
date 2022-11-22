import userApi from '@/api/user';
import LoadingButton from '@/components/common/Button/LoadingButton';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import SuccessPopup from '@/components/Popup/SuccessPopup';
import { ActionTypes } from '@/models/index';
import { showModal } from '@/redux/slices/modal';
import { getGameBalance } from '@/redux/slices/user';
import { useAppDispatch } from '@/redux/store';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface IAmountForm {
	amount: number
}

interface Props {
	onCancel: () => void
}

const ClaimGemToTokenPopup: React.FC<Props> = ({ onCancel }) => {
	const [errorMsg, setErrorMsg] = useState("");
	const dispatch = useAppDispatch();
	const [isTransacting, setTransacting] = useState<boolean>(false);
    const { publicKey } = useWallet();
	
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IAmountForm>();
	
	const onSubmit = async (data: IAmountForm) => {
		try {
			if (!publicKey) throw new WalletNotConnectedError("Wallet not connected");
			setTransacting(true);
	
			const signatureResponse: any = await userApi.getSignature(ActionTypes.Payment);
			await userApi.claimToMarketplaceToken(+data.amount, signatureResponse.signature);

			await dispatch(getGameBalance());
			dispatch(showModal(<SuccessPopup title='Claim GEM to CDG successfully' description="Check your wallet" />));
		} catch (error: any) {
			const msg = error.message;
			setErrorMsg(msg);
			dispatch(showModal(<ErrorPopup title='Fail to claim to CDG' description={`Error: ${msg}`} />));
		} finally {
			setTransacting(false);
		}
	};

	return (
		<form className="claim-gem-to-cdg" onSubmit={handleSubmit(onSubmit)}>
			<h2 className='claim-gem-to-cdg__title'>Claim GEM to CDG</h2>
			{
				errorMsg && <p className="form-error">{errorMsg}</p>
			}
			<div className="form-group">
				<label>GEM Amount</label>
				<input type="number" {...register('amount', { required: "Required" })} />
				{errors.amount && <p className="form-error">{errors.amount.message}</p>}
			</div>
			<div className='buttons'>
				<LoadingButton type='submit' title='Claim' className='button button--primary' isLoading={isTransacting} />
				<button className='button cancel-btn' onClick={onCancel}>Cancel</button>
			</div>
		</form>
  )
};

export default ClaimGemToTokenPopup;