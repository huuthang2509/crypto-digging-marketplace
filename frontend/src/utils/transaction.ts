import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
} from '@solana/spl-token';

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

export const ownerToken = Keypair.fromSecretKey(
  new Uint8Array(
    process.env.NEXT_PUBLIC_SOL_PRIVATE_KEYPAIR
      ? process.env.NEXT_PUBLIC_SOL_PRIVATE_KEYPAIR.split(',').map((e) => +e)
      : []
  )
);

export const cdgAddress = new PublicKey(
  process.env.NEXT_PUBLIC_SOL_TOKEN || '7ctmggF48CzBq6L6JvmcM5KrjfRm4zMir1ycVoFfkd31'
);

/**
 *
 * @param {string} publicStr
 * @returns {PublicKey}
 */
export const getPublicKeyFromString = (publicStr = ownerToken.publicKey.toBase58()) => {
  return new PublicKey(publicStr);
};

export const chargeFee = 0.0001;

// Use to create 2 pop up
// Pop up 1 to charge default free => this function
export const transactionWithHolderFee = async (fromWallet: PublicKey, ownerToken?: string) => {
  return getTransactionTransferCurrency(chargeFee, fromWallet, ownerToken);
};

/**
 * Transfer solana t
 * @param {number} price
 * @param {PublicKey} fromWallet
 * @param {string} ownerToken // If don't have this params, transfer currency to holder of CGD token
 */
export const getTransactionTransferCurrency = (
  price: number,
  fromWallet: PublicKey,
  ownerToken?: string
) => {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet,
      toPubkey: new PublicKey(
        ownerToken ||
          Keypair.fromSecretKey(
            new Uint8Array(
              (process.env.NEXT_PUBLIC_SOL_PRIVATE_KEYPAIR || '').split(',').map((e) => +e)
            )
          ).publicKey.toBase58()
      ),
      lamports: LAMPORTS_PER_SOL * price,
    })
  );

  return transaction;
};

/**
 * Transfer spl token to pool (hero, and cdg token)
 * @param connection
 * @param fromWallet
 * @param splToken
 * @param amount
 * @param toWallet
 * @returns
 */
export const getTransactionTransferSplToken = async (
  connection: Connection,
  fromWallet: PublicKey,
  splToken: string,
  amount: number,
  toWallet?: string
) => {
  const toWalletPublicKey = getPublicKeyFromString(toWallet);

  const splTokenPublicKey = getPublicKeyFromString(splToken);

  const cgdMint = await getMint(connection, splTokenPublicKey);

  const { blockhash } = await connection.getLatestBlockhash('finalized');
  // Get the buyer's USDC token account address
  const buyerUsdcAddress = await getAssociatedTokenAddress(cgdMint.address, fromWallet);

  // Get the shop's USDC token account address
  const toSGDAddress = await getAssociatedTokenAddress(
    cgdMint.address,
    toWallet ? toWalletPublicKey : ownerToken.publicKey
  );

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    // The buyer pays the transaction fee
    feePayer: fromWallet,
  });

  // Create the instruction to send USDC from the buyer to the shop
  const transferInstruction = createTransferCheckedInstruction(
    buyerUsdcAddress, // source
    cgdMint.address, // mint (token address)
    toSGDAddress, // destination
    fromWallet,
    amount * LAMPORTS_PER_SOL, // decimals of the USDC token
    9
  );

  // Add the instruction to the transaction
  transaction.add(transferInstruction);
  return transaction;
};

export const convertSolToSGD = async (
  connection: Connection,
  buyerPublicKey: PublicKey,
  amount: number
) => {
  const cgdMint = await getMint(connection, cdgAddress);

  // Get the buyer's USDC token account address
  const buyerUsdcAddress = await getAssociatedTokenAddress(cdgAddress, buyerPublicKey);
  console.log(buyerUsdcAddress);
  // Get the shop's USDC token account address
  const toSGDAddress = await getAssociatedTokenAddress(cdgAddress, ownerToken.publicKey);

  // Get a recent blockhash to include in the transaction
  const { blockhash } = await connection.getLatestBlockhash('finalized');

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    // The buyer pays the transaction fee
    feePayer: buyerPublicKey,
  });

  // Create the instruction to send USDC from the buyer to the shop
  const transferInstruction = createTransferCheckedInstruction(
    buyerUsdcAddress, // source
    cdgAddress, // mint (token address)
    toSGDAddress, // destination
    buyerPublicKey, // owner of source address
    amount * LAMPORTS_PER_SOL, // amount to transfer (in units of the USDC token)
    LAMPORTS_PER_SOL // decimals of the USDC token
  );

  // Add the instruction to the transaction
  transaction.add(transferInstruction);

  return transaction;
};
