import authApi from '@/api/auth';
import MessagePopup from '@/components/Popup/MessagePopup';
import { FormSignUp } from '@/models/index';
import { closeModal, showModal } from '@/redux/slices/modal';
import { setLoggedIn } from '@/redux/slices/user';
import { useAppDispatch } from '@/redux/store';
import { PATH } from '@/utils/constants';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const SignUpModal: React.FC = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const [errorMsg, setErrorMsg] = useState("");
	
	const {
		register,
		watch,
		handleSubmit,
		formState: { errors }
	} = useForm<FormSignUp>();

	const onSubmit = async (data: FormSignUp) => {
		try {
			const { username, password } = data;
			await authApi.SignUp({ username, password });
			dispatch(showModal(
				<MessagePopup 
					title='Create Account Successfully'
					description='Login now and enjoy Crypto Digging universe' 
					callBack={() => {
						dispatch(setLoggedIn(true));
						dispatch(closeModal());
						router.push(PATH.marketplace);
					}}
				/>))
		} catch (error: any) {
			const msg = JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
			setErrorMsg(msg);
			console.log(JSON.parse(error.message));
		}
	};

	return (
		<form className="sign-up" onSubmit={handleSubmit(onSubmit)}>
			<h2>Create Game Account</h2>
			{
				errorMsg && <p className="form-error">{errorMsg}</p>
			}
			<div className="form-group">
				<label>Username</label>
				<input type="text" {...register('username', {required: "Username is required"})} />
				{errors.username && <p className="form-error">{errors.username.message}</p>}
			</div>

			<div className="form-group">
				<label>Password</label>
				<input type={"password"} {...register('password', {required: "Password is required"})} />
				{errors.password && <p className="form-error">{errors.password.message}</p>}
			</div>

			<div className="form-group">
				<label>Confirm Password</label>
				<input 
					type={"password"} 
					{...register("confirmedPassword", {
						required: true,
						validate: (val: string) => {
							if (watch('password') != val) {
								return "Your passwords do no match";
							}
						}}
					)}
				/>
				{errors.confirmedPassword?.message && <p className="form-error">{errors.confirmedPassword.message}</p>}
			</div>

			<button type="submit" className="button button--primary">
				Register
			</button>
		</form>
  )
};

export default SignUpModal;