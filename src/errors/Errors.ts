import { DeepPartial } from 'utility-types';
import { _ErrorConstructor } from '../models/Model';

export class EmailAlreadyTakenError extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'EmailAlreadyTakenError';
  }
}

export class EmailContainsInvalidDomainError extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'EmailContainsInvalidDomainError';
  }
}

export type AllAPIErrors = {
  email: ['has already been taken', 'contains an invalid domain name'];
};

export type APIErrors = DeepPartial<AllAPIErrors>;

export type KeyOfAPIErrors = keyof AllAPIErrors;
export type APIErrorMessage<K extends KeyOfAPIErrors> = AllAPIErrors[K][number];

/* eslint-disable */
export type APIErrorToClassMap = Record<
  KeyOfAPIErrors,
  Record<APIErrorMessage<KeyOfAPIErrors>, _ErrorConstructor>
>;
/* eslint-enable */

export const errorToClassMap: APIErrorToClassMap = {
  email: {
    'has already been taken': EmailAlreadyTakenError,
    'contains an invalid domain name': EmailContainsInvalidDomainError,
  },
};

export const allErrors = {
  EmailAlreadyTakenError,
  EmailContainsInvalidDomainError,
};
