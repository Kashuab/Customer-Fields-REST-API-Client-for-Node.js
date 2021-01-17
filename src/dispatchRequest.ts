import fetch, { RequestInit, Response } from 'node-fetch';
import { config } from './config';

export async function dispatchRequest(path: string, fetchInit?: RequestInit): Promise<Response> {
  const { apiPrefix, apiUrl, privateAccessToken } = config;

  if (!privateAccessToken) {
    throw new Error('You must provide a private access token before any request can be dispatched');
  }

  return await fetch(`${apiUrl}${apiPrefix}${path}`, {
    ...fetchInit,
    headers: {
      'Content-Type': 'application/json',
      ...fetchInit?.headers,
      Authorization: `Bearer ${privateAccessToken}`,
    },
  });
}

export type DispatchRequestInit = {
  /**
   * Example: `"https://api.customerfields.com"`
   */
  apiUrl?: string;

  /**
   * Obtain this from the account page in the Customer Fields app.
   *
   * It is heavily recommended to use an environment variable defined as `CF_PRIVATE_ACCESS_TOKEN` instead.
   */
  privateAccessToken?: string;
};
