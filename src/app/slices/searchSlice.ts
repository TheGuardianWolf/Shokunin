import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AxiosClient } from 'app/requests';
import { RootState } from 'app/store';

type SearchState = {
  tags: string[];
  client: AxiosClient;
};

const initialState: SearchState = {
  tags: [],
  client: AxiosClient.E621,
};

export const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    setClient: (state, action: PayloadAction<AxiosClient>) => {
      state.client = action.payload;
    },
  },
});

export const { setTags, setClient } = slice.actions;

export const selectTags = (state: RootState): [string[]] => [state.search.tags];
export const selectClient = (state: RootState): [AxiosClient] => [
  state.search.client,
];

export default slice.reducer;
