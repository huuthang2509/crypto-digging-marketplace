import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as solWeb3 from "@solana/web3.js";
import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import * as nacl from "tweetnacl";
import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from "./const";

export const LPS_PER_SOL = solWeb3.LAMPORTS_PER_SOL;

export const fromWallet = Keypair.fromSecretKey(
  new Uint8Array(process.env.SOL_PRIVATE_KEYPAIR.split(",").map((e) => +e)),
);

let _solWeb3Instance = null;

export function getSolWeb3Connection(): solWeb3.Connection {
  if (_solWeb3Instance === null) {
    _solWeb3Instance = new solWeb3.Connection(
      solWeb3.clusterApiUrl(process.env.SOL_NETWORK as solWeb3.Cluster),
      "confirmed",
    );
  }

  return _solWeb3Instance;
}

export function publicKeyFromString(publicKeyString: string): solWeb3.PublicKey {
  return new solWeb3.PublicKey(publicKeyString);
}

export async function requestAirDrop(
  publicKeyString: string,
): Promise<solWeb3.RpcResponseAndContext<solWeb3.SignatureResult>> {
  const connection = getSolWeb3Connection();

  const airdropSignature = await connection.requestAirdrop(publicKeyFromString(publicKeyString), LPS_PER_SOL);
  const signature = await connection.confirmTransaction(airdropSignature);

  return signature;
}

export async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey,
): Promise<PublicKey> {
  return (
    await solWeb3.PublicKey.findProgramAddress(
      [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    )
  )[0];
}

export async function solCurrentPrice(): Promise<number> {
  const resp = await fetch(process.env.SOL_PRICE_URL, {
    method: "GET",
  });
  const data = await resp.json();

  return data.solana.usd;
}

export function getSignatureByNonce(nonce: string) {
  const msgStr = bs58.decode(nonce);

  const signature = nacl.sign.detached(msgStr, fromWallet.secretKey);
  const signatureB58 = bs58.encode(signature);
  return signatureB58;
}

export function verifyActionSignature(signature: string, nonce: string): boolean {
  const signatureUint8 = bs58.decode(signature);
  const nonceUint8 = bs58.decode(nonce);
  const pubKeyUint8 = bs58.decode(fromWallet.publicKey.toString());

  return nacl.sign.detached.verify(nonceUint8, signatureUint8, pubKeyUint8);
}
