import { findAssociatedTokenAddress, getSolWeb3Connection, LPS_PER_SOL, publicKeyFromString } from "./util";

export async function getAccountBalance(address: string) {
  const connection = getSolWeb3Connection();

  const publicKey = publicKeyFromString(address);

  const lps = await connection.getBalance(publicKey).catch((err) => {
    console.error(`Error: ${err}`);
  });

  return (lps as number) / LPS_PER_SOL;
}

export async function getTokenBalance(publicKey: string, splToken: string): Promise<number> {
  const connection = getSolWeb3Connection();

  const account = await findAssociatedTokenAddress(publicKeyFromString(publicKey), publicKeyFromString(splToken));

  try {
    const balance = await connection.getTokenAccountBalance(publicKeyFromString(account.toString()));
    return (balance.value.amount as unknown as number) / LPS_PER_SOL;
  } catch (e) {
    return 0;
  }
}
