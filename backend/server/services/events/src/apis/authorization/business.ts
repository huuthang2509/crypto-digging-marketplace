import bs58 from "bs58";
import nacl from "tweetnacl";

// eslint-disable-next-line @typescript-eslint/require-await
export async function verifyMessage(signature: string, nonce: string, wallet: string): Promise<boolean> {
  const signatureUint8 = bs58.decode(signature);
  const nonceUint8 = new TextEncoder().encode(nonce);
  const pubKeyUint8 = bs58.decode(wallet);

  return nacl.sign.detached.verify(nonceUint8, signatureUint8, pubKeyUint8);
}
