import qs from 'qs';
import axios from './baseAPI';

const heroApi = {
  getMyHerosInventory: (searchObj: any, page?: number) => {
    const params = qs.stringify({
      page,
      size: 8,
      ...searchObj,
      search: searchObj.search ? searchObj.search : undefined,
      quality: searchObj.quality.length ? searchObj.quality.join(',') : undefined,
    });
    const url = `/heros/inventory?${params}`;
    return axios.get(url);
  },
};

export default heroApi;
