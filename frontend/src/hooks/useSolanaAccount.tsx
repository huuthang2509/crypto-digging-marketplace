import authApi from "@/api/auth";
import SignUpModal from "@/components/auth/SignUp";
import { showModal } from "@/redux/slices/modal";
import { setLoggedIn } from "@/redux/slices/user";
import { useAppDispatch } from "@/redux/store";
import { ACCESS_TOKEN, PATH } from "@/utils/constants";
import { generateRandomStringBS58 } from "@/utils/generate-nonce";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

export const useSolanaAccount = () => {
	const [account, setAccount] = useState<any>(null);
	const [transactions, setTransactions] = useState<any>(null);
	const { connection } = useConnection();
	const { publicKey, signMessage } = useWallet();
	const dispatch = useAppDispatch();
	const router = useRouter();
	
	const init = useCallback(async () => {
		if (publicKey) {
			// const balance = await connection.getBalance(publicKey);
			// dispatch(setBalance(Number(balance)));

			let acc = await connection.getAccountInfo(publicKey);
			setAccount(acc);
			let transactions = await connection.getConfirmedSignaturesForAddress2(publicKey, { limit: 10 });
			setTransactions(transactions);
		}
	}, [publicKey, connection]);
  
	const login = async () => {
		try {
			// `publicKey` will be null if the wallet isn't connected
			if (!publicKey) throw new Error('Wallet not connected!');
			// `signMessage` will be undefined if the wallet doesn't support it
			if (!signMessage) throw new Error('Wallet does not support message signing!');
	
			const nonce = generateRandomStringBS58();
			const message = new TextEncoder().encode(nonce);
			const signature = await signMessage(message);
			const payload = {
				nonce,
				signature: bs58.encode(signature),
				walletAddress: publicKey.toString()
			};
			
			const res: any = await authApi.postAuthSignIn(payload);
			res.access?.token && localStorage.setItem(ACCESS_TOKEN, res.access.token);
			if (res.isNeedRegister) {
        		dispatch(showModal(<SignUpModal />));
      		}
			else {
				dispatch(setLoggedIn(true));
				router.push(PATH.marketplace);
			}
		} catch (error) {
			localStorage.removeItem(ACCESS_TOKEN);
			console.log(error);
		}
	}

	useEffect(() => {
		let interval: any = null;

		if (publicKey) {
			// (async () => {
			// 	const balance = await connection.getBalance(publicKey);
			// 	dispatch(setBalance(Number(balance)));
			// })();
			interval = setInterval(init, 10000);
			if (!localStorage.getItem(ACCESS_TOKEN)) login();
		}

		return () => clearInterval(interval);
	}, [init, publicKey]);
  
	return { account, transactions };
}
  