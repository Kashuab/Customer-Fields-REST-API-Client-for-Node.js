import fetch, { RequestInit, Response } from 'node-fetch';

export class RequestDispatcher {
  apiUrl = 'https://app.customerfields.com';
  apiPrefix = '/api/v2';

  privateAccessToken: string;

  constructor(init?: RequestDispatcherInit) {
    const privateAccessToken = process.env.CF_PRIVATE_ACCESS_TOKEN || init?.privateAccessToken;
    if (!privateAccessToken) {
      throw new Error('You must provide a private access token');
    }

    this.privateAccessToken = privateAccessToken;

    if (init?.apiUrl) this.apiUrl = init.apiUrl;
  }

  getApiUrl(path: string): string {
    return `${this.apiUrl}${this.apiPrefix}${path}`;
  }

  async dispatchRequest(path: string, opts?: RequestInit): Promise<Response> {
    return await fetch(this.getApiUrl(path), {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        ...opts?.headers,
        Authorization: `Bearer ${this.privateAccessToken}`,
      },
    });
  }
}

export type RequestDispatcherInit = {
  /**
   * Example: `"https://api.customerfields.com"`
   */
  apiUrl?: string;

  /**
   * Obtain this from the account page in the Customer Fields app.
   *
   * You can also define this an environment variable defined as `CF_PRIVATE_ACCESS_TOKEN`
   */
  privateAccessToken?: string;
};
