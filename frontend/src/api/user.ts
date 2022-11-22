import { ActionTypes, MarketRefType } from '@/models/index';
import axios from './baseAPI';

const userApi = {
  pushToMarket: (refId: string, refType: MarketRefType, CDGPrice: number, signature: string) => {
    const url = '/marketplace';
    return axios.post(url, { refId, refType, CDGPrice, sign: { signature } });
  },
  removeItemFromMarket: (refId: string, refType: MarketRefType, signature: string) => {
    const url = '/marketplace/remove';
    return axios.post(url, { refId, refType, sign: { signature } });
  },
  getSignature: (action: ActionTypes) => {
    const url = '/user/action/generate-signature';
    return axios.post(url, { action });
  },
  getGameBalance: () => {
    const url = '/get-game-balance';
    return axios.get(url);
  },
  getUserHistory: (queryObject: any) => {
    const url = '/user/histories';
    return axios.get(url, {
      params: {
        ...queryObject,
        logType: queryObject.logType || MarketRefType.Hero,
        page: queryObject.page || 1,
        size: 10,
      },
    });
  },
  transferCDGToken: (amount: number, signature: string) => {
    const url = '/transfer/transfer-cdg-token';
    return axios.post(url, { amount, sign: { signature } });
  },
  withdraw: (amount: number, signature: string) => {
    const url = '/withdraw';
    return axios.post(url, { amount, sign: { signature } });
  },
  claimToMarketplaceToken: (amount: number, signature: string) => {
    const url = '/withdraw-gem';
    return axios.post(url, { amount, sign: { signature } });
  },
};

export default userApi;
