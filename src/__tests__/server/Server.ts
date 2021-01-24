import { ResponseComposition, RestContext } from 'msw/lib/types';
import { setupServer } from 'msw/node';
import { APIErrors } from '../../errors/Errors';
import CustomerHandlers from './CustomerHandlers';

export const server = setupServer(...CustomerHandlers);

let nextErrorStatusCode: number | null, nextErrorPayload: APIErrors | null;

export const setNextError = (statusCode: number, errors: APIErrors): void => {
  nextErrorStatusCode = statusCode;
  nextErrorPayload = errors;
};

export const handleMockErrorResponse = (
  res: ResponseComposition<any>,
  ctx: RestContext,
): ReturnType<ResponseComposition<any>> | void => {
  if (nextErrorPayload && nextErrorStatusCode) {
    const response = res(ctx.status(nextErrorStatusCode), ctx.json({ errors: nextErrorPayload }));

    nextErrorStatusCode = null;
    nextErrorPayload = null;

    return response;
  }
};
