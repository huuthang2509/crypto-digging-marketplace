import boxApi from '@/api/box';
import heroApi from '@/api/hero';
import userApi from '@/api/user';
import { MarketRefType } from '@/models/index';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export const getGameBalance: any = createAsyncThunk(
  'user/getGameBalance',
  async (_, { getState }) => {
    try {
      const res = await userApi.getGameBalance();
      return res;
    } catch (error) {
      throw error;
    }
  }
);

export const getMyBoxInventory: any = createAsyncThunk(
  'user/getMyBoxInventory',
  async (page: number, { getState }) => {
    try {
      const { user } = getState() as { user: IState };
      const res = await boxApi.getMyBoxInventory(
        user.boxInventory.search,
        page || user.boxInventory.currentPage
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
);

export const getMyHeroInventory: any = createAsyncThunk(
  'user/getMyHeroInventory',
  async (page: number, { getState }) => {
    try {
      const { user } = getState() as { user: IState };
      const res = await heroApi.getMyHerosInventory(
        user.heroInventory.search,
        page || user.heroInventory.currentPage
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
);

interface IState {
  isLoggedIn: boolean;
  gameBalance: {
    balance: number;
    unit: string;
  };
  selectedInventoryTab: MarketRefType;
  boxInventory: {
    result: any[];
    search: {
      search: string;
      quality: string[];
    };
    total: number;
    currentPage: number;
    totalPages: number;
  };
  heroInventory: {
    result: any[];
    total: number;
    search: {
      search: string;
      quality: string[];
    };
    currentPage: number;
    totalPages: number;
  };
}

const initialState: IState = {
  isLoggedIn: false,
  gameBalance: {
    balance: 0,
    unit: 'gem',
  },
  selectedInventoryTab: MarketRefType.Hero,
  boxInventory: {
    result: [],
    total: 0,
    search: {
      search: '',
      quality: [],
    },
    currentPage: 1,
    totalPages: 0,
  },
  heroInventory: {
    result: [],
    total: 0,
    search: {
      search: '',
      quality: [],
    },
    currentPage: 1,
    totalPages: 0,
  },
};

const AuthSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setInventorySearchType(state, action) {
      state.selectedInventoryTab = action.payload;
    },
    setBoxSearch(state, action) {
      return {
        ...state,
        boxInventory: {
          ...state.boxInventory,
          search: {
            ...state.boxInventory.search,
            ...action.payload,
          },
        },
      };
    },
    setHeroSearch(state, action) {
      return {
        ...state,
        heroInventory: {
          ...state.heroInventory,
          search: {
            ...state.heroInventory.search,
            ...action.payload,
          },
        },
      };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, { payload }) => ({
      ...state,
      ...payload.user,
    }),
    [getGameBalance.fulfilled]: (state, action) => {
      state.gameBalance.balance = action.payload?.balance ?? 0;
      state.gameBalance.unit = action.payload?.unit || 'gem';
    },
    [getMyBoxInventory.fulfilled]: (state, action) => {
      return {
        ...state,
        boxInventory: {
          search: state.boxInventory.search,
          result: [...action.payload.data],
          total: action.payload.pagination.total,
          currentPage: action.payload.pagination.page,
          totalPages: action.payload.pagination.totalPages,
        },
      };
    },
    [getMyHeroInventory.fulfilled]: (state, action) => {
      return {
        ...state,
        heroInventory: {
          search: state.heroInventory.search,
          result: [...action.payload.data],
          total: action.payload.pagination.total,
          currentPage: action.payload.pagination.page,
          totalPages: action.payload.pagination.totalPages,
        },
      };
    },
  },
});

const { reducer, actions } = AuthSlice;
export const { setLoggedIn, setInventorySearchType, setBoxSearch, setHeroSearch } = actions;
export { AuthSlice as AuthReducer };
export default reducer;
