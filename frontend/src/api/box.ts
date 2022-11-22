import qs from 'qs';
import axios from './baseAPI';

const boxApi = {
  getBoxes: () => {
    const url = '/boxes';
    return axios.get(url);
  },
  getMyBoxInventory: (searchObj: any, page?: number) => {
    const params = qs.stringify({
      page,
      size: 12,
      ...searchObj,
      search: searchObj.search ? searchObj.search : undefined,
      quality: searchObj.quality.length ? searchObj.quality.join(',') : undefined,
    });
    const url = `/boxes/inventory?${params}`;
    return axios.get(url);
  },
  purchaseBoxes: (amount: number, boxInfoId: string, signature: string) => {
    const url = '/boxes/purchase';
    return axios.post(url, { amount, boxInfoId, sign: { signature } });
  },
  openBox: (boxId: string, signature: string) => {
    const url = '/boxes/open';
    return axios.post(url, { boxId, sign: { signature } });
  },
};

export default boxApi;
