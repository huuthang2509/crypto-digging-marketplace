import { getTransactionTransferCurrency, getTransactionTransferSplToken } from '@/utils/transaction';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback } from 'react';

// TODO: Override this function
export const SendOneLamportToRandomAddress: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, signTransaction } = useWallet();

    const exchangeSolToToken = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();

        // nhap so token muon
        // Vd: 1 sol = 1 CDG
        const solAmount = 1;
        const solExchange = 111;
        const transaction = getTransactionTransferCurrency(solAmount * solExchange, publicKey);
        const signatureCharge = await sendTransaction(transaction, connection);

        const sign = await connection.confirmTransaction(signatureCharge, 'processed');

        if (!sign) throw new Error();

        // Call api de chuyen spl token lai cho no
        // uri /transfer/transfer-cdg-token
    }, [publicKey, sendTransaction, connection]);

    const withdrawMoney = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();

        // nhap so token muon
        // Vd: 1 sol = 1 CDG
        const CDGAmount = 1;
        const CDGExchange = 0.111;
        const transaction = await getTransactionTransferSplToken(
            connection,
            publicKey,
            process.env.NEXT_PUBLIC_CGD_TOKEN || '7ctmggF48CzBq6L6JvmcM5KrjfRm4zMir1ycVoFfkd31',
            CDGAmount*CDGExchange);
        const signatureCharge = await sendTransaction(transaction, connection);

        const sign = await connection.confirmTransaction(signatureCharge, 'processed');

        console.log(sign);
        if (!sign) throw new Error();
        console.log("haha")
        // Call api de chuyen solana lai cho no
        // uri /withdraw

    }, [publicKey, sendTransaction, connection]);


    return (
        <>
            <button onClick={exchangeSolToToken} disabled={!publicKey}>
                Exchange currency
            </button>
            <button onClick={withdrawMoney} disabled={!publicKey}>
                Withdraw currency
            </button>
        </>
    );
};