import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { fromWallet, getSolWeb3Connection, LPS_PER_SOL, publicKeyFromString } from "./util";

export async function createSplToken(to: string, amount = 1) {
  console.log("Creating spl-token...");

  const connection = getSolWeb3Connection();

  const toWallet = publicKeyFromString(to);

  const mint = await Token.createMint(connection, fromWallet, fromWallet.publicKey, null, 9, TOKEN_PROGRAM_ID);
  const mintToken = await mint.getOrCreateAssociatedAccountInfo(fromWallet.publicKey);
  const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(toWallet);
  await mint.mintTo(mintToken.address, fromWallet.publicKey, [], amount * LPS_PER_SOL);

  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      mintToken.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      [],
      amount * LPS_PER_SOL,
    ),
  );

  await sendAndConfirmTransaction(connection, transaction, [fromWallet]);

  console.log("Mint token address: ", mint.publicKey.toBase58());

  return mint.publicKey.toBase58();
}
