import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { Action } from 'redux';
import { IClientsList } from 'redux-axios-middleware';

export enum RequestStatus {
  NONE = 'NONE',
  REQUESTING = 'REQUESTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum AxiosClient {
  E621 = 'e621',
  E926 = 'e926',
}

export type AxiosRequestAction = {
  payload: {
    client: AxiosClient;
    request: AxiosRequestConfig;
  };
};

export type AxiosResponseSuccessAction<T> = Action<string> & {
  payload: AxiosResponse<T>;
  meta?: {
    previousAction: Action<any>;
  };
};

export type AxiosResponseErrorAction = Action<string> & {
  error?: AxiosError;
  meta?: {
    previousAction: Action<any>;
  };
};

export type AxiosResponseAction<T> =
  | AxiosResponseSuccessAction<T>
  | AxiosResponseErrorAction;

const e621Client = axios.create({
  baseURL: 'https://e621.net',
});

export const clients: IClientsList = {
  default: {
    client: e621Client,
  },
  [AxiosClient.E621]: {
    client: e621Client,
  },
  [AxiosClient.E926]: {
    client: axios.create({
      baseURL: 'https://e926.net',
    }),
  },
};

export const parseParams = (url: string) => {
  return Object.fromEntries(
    url
      .split('?')[1]
      ?.split('&')
      ?.map((param) => param.split('=')) || []
  );
};
