import { FormAuthSignIn, FormPostSignUp } from '@/models/index';
import axios from './baseAPI';

const authApi = {
  postAuthSignIn: (body: FormAuthSignIn) => {
    const url = '/auth/sign-in';
    return axios.post(url, body);
  },
  SignUp: (body: FormPostSignUp) => {
    const url = '/sign-up';
    return axios.post(url, body);
  },
  getAccountBalance: () => {
    const url = '/user/info/balance';
    return axios.get(url);
  },
};

export default authApi;
