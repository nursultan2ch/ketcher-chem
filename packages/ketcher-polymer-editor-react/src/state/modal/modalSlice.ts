/****************************************************************************
 * Copyright 2021 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdditionalModalProps } from 'components/modal/modalContainer/types';
import { RootState } from 'state';

interface ModalState {
  name: string | null;
  isOpen: boolean;
  additionalProps: AdditionalModalProps | null;
  errorTooltipText: string;
  errorModalText: string;
}

const initialState: ModalState = {
  name: null,
  isOpen: false,
  additionalProps: null,
  errorTooltipText: '',
  errorModalText: '',
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<
        string | { name: string; additionalProps: AdditionalModalProps }
      >,
    ) => {
      if (typeof action.payload === 'string') {
        state.name = action.payload;
      } else {
        state.name = action.payload.name;
        state.additionalProps = action.payload.additionalProps;
      }

      state.isOpen = true;
    },
    closeModal: (state) => {
      state.name = null;
      state.isOpen = false;
      state.additionalProps = null;
    },
    openErrorTooltip: (state, action: PayloadAction<string>) => {
      state.errorTooltipText = action.payload;
    },
    closeErrorTooltip: (state) => {
      state.errorTooltipText = '';
    },
    openErrorModal: (state, action: PayloadAction<string>) => {
      state.errorModalText = action.payload;
    },
    closeErrorModal: (state) => {
      state.errorModalText = '';
    },
  },
});

export const {
  openModal,
  closeModal,
  openErrorTooltip,
  closeErrorTooltip,
  openErrorModal,
  closeErrorModal,
} = modalSlice.actions;

export const selectModalName = (state: RootState): string | null =>
  state.modal.name;
export const selectModalIsOpen = (state: RootState): boolean =>
  state.modal.isOpen;
export const selectAdditionalProps = (
  state: RootState,
): AdditionalModalProps | null => state.modal.additionalProps;
export const selectErrorTooltipText = (state: RootState): boolean =>
  state.modal.errorTooltipText;
export const selectErrorModalText = (state: RootState): string =>
  state.modal.errorModalText;

export const modalReducer = modalSlice.reducer;
