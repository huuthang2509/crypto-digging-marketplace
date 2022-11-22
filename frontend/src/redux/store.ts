import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { nextReduxCookieMiddleware, wrapMakeStore } from 'next-redux-cookie-wrapper';
import { createWrapper } from 'next-redux-wrapper';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import GeneralSlice from './slices/general';
import PopupModal from './slices/modal';
import { AuthReducer } from './slices/user';
import Web3Provider from './slices/web3Provider';

export const store = configureStore({
  reducer: {
    web3Provider: Web3Provider,
    general: GeneralSlice,
    popup: PopupModal,
    [AuthReducer.name]: AuthReducer.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(
      nextReduxCookieMiddleware({
        subtrees: [`${AuthReducer.name}.isLoggedIn`],
      })
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// export const makeStore = () => store;
const makeStore = wrapMakeStore(() => store);
export const wrapper = createWrapper<AppStore>(makeStore);

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
