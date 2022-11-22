import { createSlice } from '@reduxjs/toolkit';
import React from 'react';

interface IModal {
  show: boolean;
  component: React.ReactNode;
}

const initialState: IModal = {
  show: false,
  component: null,
};

const ModalSlice = createSlice({
  name: 'Popup',
  initialState,
  reducers: {
    showModal(state, action) {
      state.component = action.payload;
      state.show = true;
    },
    closeModal(state) {
      state.show = false;
      state.component = null;
    },
  },
  extraReducers: (builder) => {},
});

const { reducer, actions } = ModalSlice;
export const { showModal, closeModal } = actions;
export default reducer;
