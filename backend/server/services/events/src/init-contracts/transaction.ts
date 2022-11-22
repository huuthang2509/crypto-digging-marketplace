import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { fromWallet, getSolWeb3Connection, LPS_PER_SOL, publicKeyFromString } from "./util";

export const chargeFee = 0.0001;

export const ratioExchangeGem = 1;

export const transactionWithHolderFee = async (from, to) => {
  return transaction(from, to, chargeFee);
};

export async function transferSolFromMasterWallet(to: string, amount: number) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: publicKeyFromString(to),
      lamports: amount * LPS_PER_SOL,
    }),
  );

  // Sign the transaction
  const connection = getSolWeb3Connection();
  const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);

  console.log("Sign: ", signature);

  return signature;
}

export async function transaction(from, to, amount: number): Promise<string> {
  console.log("Executing transaction...");

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKeyFromString(from.keyPair.publicKey.toString()),
      toPubkey: publicKeyFromString(to),
      lamports: amount * LPS_PER_SOL,
    }),
  );

  // Sign the transaction
  const connection = getSolWeb3Connection();
  const signature = await sendAndConfirmTransaction(connection, transaction, [from.keyPair]);

  console.log("Sign: ", signature);

  return signature;
}

export async function transferSplToken(to: string, tokenSpl: string, amount = 1): Promise<string> {
  console.log("Executing transaction...");

  const connection = getSolWeb3Connection();

  const mintPublicKey = publicKeyFromString(tokenSpl);
  const mintToken = new Token(connection, mintPublicKey, TOKEN_PROGRAM_ID, fromWallet);

  const fromAccountWallet = await mintToken.getOrCreateAssociatedAccountInfo(fromWallet.publicKey);

  const toWallet = publicKeyFromString(to);
  await mintToken.getOrCreateAssociatedAccountInfo(toWallet);

  const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
    mintToken.associatedProgramId,
    mintToken.programId,
    mintPublicKey,
    toWallet,
  );

  const transaction = new Transaction();

  const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);
  if (!receiverAccount) {
    transaction.add(
      Token.createAssociatedTokenAccountInstruction(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintPublicKey,
        associatedDestinationTokenAddr,
        toWallet,
        fromWallet.publicKey,
      ),
    );
  } else {
    transaction.add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        fromAccountWallet.address,
        associatedDestinationTokenAddr,
        fromWallet.publicKey,
        [fromWallet],
        amount * LPS_PER_SOL,
      ),
    );
  }

  // Sign the transaction
  const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);

  console.log("Sign: ", signature);

  return signature;
}
