import { AppThunk, RootState } from 'app/store';
import {
  AxiosClient,
  AxiosRequestAction,
  AxiosResponseSuccessAction,
  RequestStatus,
} from 'app/requests';

import { createSlice } from '@reduxjs/toolkit';
import { isEqualSearch } from 'util/search-utils';

export type E621APIPostsMeta = {
  tags: string[];
  limit: number;
};

type E621APIState = {
  posts: E621PostPages;
  postsStatus: RequestStatus;
  postsMeta: E621APIPostsMeta;
  client: AxiosClient;
};

export type GetPostsPageAction = AxiosRequestAction & {
  payload: {
    page: number;
  };
  meta: E621APIPostsMeta;
};

const initialState: E621APIState = {
  posts: [],
  postsStatus: RequestStatus.NONE,
  postsMeta: {
    tags: [],
    limit: 100,
  },
  client: AxiosClient.E621,
};

export const slice = createSlice({
  name: 'e621-api',
  initialState,
  reducers: {
    getPostsPage: {
      reducer: (state, action: GetPostsPageAction) => {
        state.postsStatus = RequestStatus.REQUESTING;

        if (
          !isEqualSearch(
            {
              client: action.payload.client,
              meta: action.meta,
            },
            {
              client: state.client,
              meta: state.postsMeta,
            }
          )
        ) {
          state.client = action.payload.client;
          state.postsMeta = action.meta;
          state.posts = [];
        }
      },
      prepare: (
        pageNumber: number,
        tags: string[] = [],
        limit: number = 100,
        client: AxiosClient = AxiosClient.E621
      ): GetPostsPageAction => {
        return {
          payload: {
            client,
            page: pageNumber,
            request: {
              url: `/posts.json?page=${pageNumber + 1}&limit=${limit}${
                tags ? `&tags=${tags.join(' ')}` : ''
              }`,
            },
          },
          meta: {
            limit,
            tags,
          },
        };
      },
    },
    getPostsPage_SUCCESS: (
      state,
      action: AxiosResponseSuccessAction<E621Payload> & {
        meta?: { previousAction: GetPostsPageAction };
      }
    ) => {
      if (
        action.payload.config.url &&
        action.payload.data.posts &&
        action.meta
      ) {
        state.posts[action.meta.previousAction.payload.page] =
          action.payload.data.posts;
        state.postsStatus = RequestStatus.SUCCESS;
      } else {
        state.postsStatus = RequestStatus.ERROR;
      }
    },
    getPostsPage_ERROR: (state) => {
      state.postsStatus = RequestStatus.ERROR;
    },
  },
});

export const { getPostsPage } = slice.actions;

export const getNextPostsPage = (
  tags: string[] = [],
  limit: number = 100,
  client: AxiosClient = AxiosClient.E621
): AppThunk => (dispatch, getState) => {
  const { e621API: state } = getState();
  const actionMeta = { tags, limit };
  const page = !isEqualSearch(
    {
      client,
      meta: actionMeta,
    },
    {
      client: state.client,
      meta: state.postsMeta,
    }
  )
    ? 0
    : state.posts.length;
  dispatch(getPostsPage(page, tags, limit, client));
};

export const selectPosts = (
  state: RootState
): [E621Post[][], RequestStatus] => [
  state.e621API.posts,
  state.e621API.postsStatus,
];

export const selectPostsMeta = (state: RootState) => [state.e621API.postsMeta];

export const selectClient = (state: RootState) => [state.e621API.client];

export default slice.reducer;

export type E621PostPages = E621Post[][];

export enum E621Rating {
  Safe = 's',
  Questionable = 'q',
  Explicit = 'e',
}

export const E621RatingStringMap = Object.freeze({
  s: 'Safe',
  q: 'Questionable',
  e: 'Explicit',
});

export type E621BaseImage = {
  width: number;
  height: number;
  url: string;
};

export type E621File = E621BaseImage & {
  ext: string;
  size: number;
  md5: string;
};

export type E621Preview = E621BaseImage;

export type E621Sample = E621BaseImage & {
  has: boolean;
};

export type E621Score = {
  up: number;
  down: number;
  total: number;
};

export type E621Tags = {
  general: string[];
  species: string[];
  character: string[];
  copyright: string[];
  artist: string[];
  invalid: string[];
  lore: string[];
  meta: string[];
};

export type E621Flags = {
  pending: boolean;
  flagged: boolean;
  note_locked: boolean;
  status_locked: boolean;
  rating_locked: boolean;
  deleted: boolean;
};

export type E621Relationships = {
  parentId: number | null;
  has_children: boolean;
  has_active_children: boolean;
  children: number[];
};

export type E621Payload = {
  posts: E621Post[];
};

export type E621Post = {
  id: number;
  created_at: string;
  updated_at: string;
  file: E621File;
  preview: E621Preview;
  sample: E621Sample;
  score: E621Score;
  tags: E621Tags;
  flags: E621Flags;
  rating: E621Rating;
  fav_count: number;
  sources: string[];
  pools: string[];
  relationships: E621Relationships;
  approver_id: number | null;
  uploader_id: number;
  description: string;
  comment_count: number;
  is_favorited: boolean;
};
