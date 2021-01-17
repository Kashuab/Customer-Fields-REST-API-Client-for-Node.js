import fetch, { RequestInit, Response } from "node-fetch";

export type RequestDispatcherInit = {
  /**
   * Example: `"https://api.customerfields.com"`
   */
  apiUrl?: string;

  /**
   * Example: `"your-shop.myshopify.com"`
   * 
   * You can also define this an environment variable defined as `CF_MYSHOPIFY_DOMAIN`
   */
  myshopifyDomain?: string;

  /**
   * Obtain this from the account page in the Customer Fields app.
   * 
   * You can also define this an environment variable defined as `CF_PRIVATE_ACCESS_TOKEN`
   */
  privateAccessToken?: string;
}

export class RequestDispatcher {
  apiUrl = 'https://api.customerfields.com';
  apiPrefix = '/api/v2';

  myshopifyDomain: string;
  privateAccessToken: string;

  constructor(init?: RequestDispatcherInit) {
    const myshopifyDomain = process.env.CF_MYSHOPIFY_DOMAIN || init?.myshopifyDomain;
    const privateAccessToken = process.env.CF_PRIVATE_ACCESS_TOKEN || init?.privateAccessToken;

    if (!myshopifyDomain) {
      throw new Error('You must provide a myshopify domain')
    }

    if (!privateAccessToken) {
      throw new Error('You must provide a private access token');
    }

    this.myshopifyDomain = myshopifyDomain;
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
        ...opts?.headers,
        Authorization: `Bearer ${this.privateAccessToken}`,
        'X-Shopify-Shop-Domain': this.myshopifyDomain,
      },
    });
  }
}
