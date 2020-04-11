import {
  Action,
  ThunkAction,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';

import { clients } from './requests';
import e621APIReducer from 'app/slices/e621APISlice';
import { multiClientMiddleware } from 'redux-axios-middleware';
import searchReducer from 'app/slices/searchSlice';

export const store = configureStore({
  reducer: {
    e621API: e621APIReducer,
    search: searchReducer,
  },
  middleware: [...getDefaultMiddleware(), multiClientMiddleware(clients)],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
