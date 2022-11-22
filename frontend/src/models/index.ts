export interface FormAuthSignIn {
  nonce: string;
  signature: string;
  walletAddress: string;
}

export interface FormPostSignUp {
  username: string;
  password: string;
}

export interface FormSignUp extends FormPostSignUp {
  confirmedPassword: string;
}

export enum HeroBoxesType {
  Common = 'common',
  Rare = 'rate',
  Epic = 'epic',
  Legend = 'legend',
}

export interface BoxesTypes {
  id: string;
  name: string;
  CDGPrice: number;
  img: string;
  boxType: HeroBoxesType;
  commonRatio: number;
  rareRatio: number;
  epicRatio: number;
  legendRatio: number;
  createdAt: string;
  updatedAt: string;
}

export enum MarketRefType {
  Hero = 'hero',
  Box = 'box',
}

export enum ActionTypes {
  TransferOwner = 'transfer_owner',
  Payment = 'payment', // when using currency to transfer for another user,
  Purchase = 'purchase',
  SendToMarket = 'send_to_market',
  Remove = 'remove',
  OpenBox = 'open_box',
}

export enum UserLogAction {
  Purchase = "purchase",
  SaleUp = "sale_up",
  SaleDown = "sale_down",
  Claim = "claim",
  OpenBox = "open_box"
}