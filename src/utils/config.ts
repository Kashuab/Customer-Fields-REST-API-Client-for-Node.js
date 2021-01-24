export type CFApiClientConfig = {
  /**
   * Example: `"https://api.customerfields.com"`
   */
  apiUrl: string;
  apiPrefix: string;

  /**
   * Obtain this from the account page in the Customer Fields app.
   *
   * It is heavily recommended to use an environment variable defined as `CF_PRIVATE_ACCESS_TOKEN` instead,
   * so that your private information is kept out of your source code. It keeps your security tight.
   */
  privateAccessToken?: string;
};

export const config: CFApiClientConfig = {
  apiUrl: process.env.CF_API_URL || 'https://app.customerfields.com',
  apiPrefix: process.env.CF_API_PREFIX || '/api/v2',
  privateAccessToken: process.env.CF_PRIVATE_ACCESS_TOKEN,
};
