import fetch, { RequestInit, Response } from 'node-fetch';
import { config } from './config';
import { APIErrors, errorToClassMap, KeyOfAPIErrors } from './errors/Errors';
import { _ErrorConstructor } from './models/Model';

export type PaginationOpts = {
  page: number;
  limit: number;
};

export async function dispatchRequest(path: string, opts?: RequestInit): Promise<Response> {
  const { apiPrefix, apiUrl, privateAccessToken } = config;

  if (!privateAccessToken) {
    throw new Error('You must provide a private access token before any request can be dispatched');
  }

  const response = await fetch(`${apiUrl}${apiPrefix}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...opts?.headers,
      Authorization: `Bearer ${privateAccessToken}`,
    },
  });

  if (!response.ok) {
    let errors;

    try {
      errors = (await response.json()).errors;
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to dispatch request, received status code ${response.status}: ${response.statusText}`);
    }

    const ErrorClass = getErrorClassFromServerErrors(errors);

    if (ErrorClass) {
      throw new ErrorClass();
    }
  }

  return response;
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

export type ErrorDict = Record<string, string[]>;

/* eslint-disable */
export type ErrorToClassMap<E extends ErrorDict = ErrorDict> = Record<
  E[keyof E][number],
  Record<keyof E, _ErrorConstructor>
>;
/* eslint-enable */

export class MissingResponseErrorClassError extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'MissingResponseErrorClassError';
  }
}

export function getErrorClassFromServerErrors(errors: APIErrors): typeof Error | undefined {
  let errorClass: typeof Error | undefined;
  const errorKeys: KeyOfAPIErrors[] = Object.keys(errors) as KeyOfAPIErrors[];

  errorKeys.forEach((key) => {
    const errorMessages = errors[key];

    errorMessages.forEach((message) => {
      const ErrorClass = errorToClassMap[key][message];

      if (!ErrorClass) {
        console.log("Couldn't find an error class for the following error message:");
        console.log(`key: ${key}, message: ${message}`);
        console.log(
          "If you're seeing this error, please make an issue for the customer-fields-api-client-node project in GitLab!",
        );

        throw new MissingResponseErrorClassError();
      }

      errorClass = ErrorClass as typeof Error;
    });
  });

  return errorClass;
};
