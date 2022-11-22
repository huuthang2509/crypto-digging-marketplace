import { createSlice } from '@reduxjs/toolkit';

interface HomeLoading {
  showLoading: boolean;
}

const initialState: HomeLoading = {
  showLoading: true,
};

const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    disableAppLoadingScreen(state, payload) {
      state.showLoading = false;
    },
  },
  extraReducers: (builder) => {},
});

const { reducer, actions } = HomeSlice;
export const { disableAppLoadingScreen } = actions;
export default reducer;
