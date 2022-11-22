import { MarketRefType } from '@/models/index';
import axios from './baseAPI';

const marketplaceAPI = {
  getMarketItems: (queryObject: any, type: MarketRefType = MarketRefType.Hero) => {
    const url = '/marketplace';
    return axios.get(url, {
      params: {
        ...queryObject,
        type: queryObject.type || MarketRefType.Hero,
        page: queryObject.page || 1,
        size: 12,
      },
    });
  },
  getMarketItem: (id: string | number) => {
    const url = `/marketplace/${id}`;
    return axios.get(url);
  },
  purchase: (refId: string | number, refType: MarketRefType, signature: string) => {
    const url = `/marketplace/purchase`;
    return axios.post(url, { refId, refType, sign: { signature } });
  },
};

export default marketplaceAPI;
