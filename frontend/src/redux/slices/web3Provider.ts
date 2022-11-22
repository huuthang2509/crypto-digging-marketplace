import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

interface IWeb3Provider {
  provider: any;
  web3Provider: any;
  web3Modal: any;
  address: string;
  chainId: number;
}

export const connectWallet: any = createAsyncThunk('Web3Provider/connectWallet', async () => {
  try {
    const web3Modal = new Web3Modal({ cacheProvider: true });
    const provider = await web3Modal.connect();

    const web3Provider = new ethers.providers.Web3Provider(provider);

    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    const network = await web3Provider.getNetwork();

    return { web3Modal, provider, web3Provider, address, chainId: network.chainId };
  } catch (error) {
    throw error;
  }
});

export const disconnectWallet = createAsyncThunk(
  'Web3Provider/disconnectWallet',
  async (_, { getState }) => {
    try {
      const { web3Provider: Web3Provider } = getState() as { web3Provider: any };
      const { web3Modal } = Web3Provider;

      await web3Modal.clearCachedProvider();

      return {};
    } catch (error) {
      throw error;
    }
  }
);

const initialState: IWeb3Provider = {
  provider: null,
  web3Provider: null,
  web3Modal: null,
  address: '',
  chainId: 1,
};

const web3ProviderSlice = createSlice({
  name: 'web3Provider',
  initialState,
  reducers: {
    setWalletAddress(state, action) {
      return {
        ...state,
        address: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload,
        };
      })
      .addCase(disconnectWallet.fulfilled, (state, action) => {
        return {
          ...state,
          ...initialState,
        };
      });
  },
});

const { reducer, actions } = web3ProviderSlice;
export const { setWalletAddress } = actions;
export default reducer;
