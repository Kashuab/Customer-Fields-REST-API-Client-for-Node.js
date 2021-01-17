export class MissingCustomerErrorClassError extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'MissingCustomerErrorClassError';
  }
}

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

export type CustomerErrors = {
  email: ['has already been taken', 'contains an invalid domain name'];
};

export type CustomerErrorMessage<K extends keyof CustomerErrors> = CustomerErrors[K][number];

/* eslint-disable */
export type CustomerErrorToClassMap = Record<
  keyof CustomerErrors,
  Record<CustomerErrorMessage<keyof CustomerErrors>, new (message?: string) => Error>
>;
/* eslint-enable */

export const customerErrorToClassMap: CustomerErrorToClassMap = {
  email: {
    'has already been taken': EmailAlreadyTakenError,
    'contains an invalid domain name': EmailContainsInvalidDomainError,
  },
};

export const getCustomerError = (errors: CustomerErrors): typeof Error | undefined => {
  let errorClass: typeof Error | undefined;
  const keys: (keyof CustomerErrors)[] = Object.keys(errors) as (keyof CustomerErrors)[];

  keys.forEach((key) => {
    const errorMessages = errors[key];

    errorMessages.forEach((message) => {
      const ErrorClass = customerErrorToClassMap[key][message];

      if (!ErrorClass) {
        console.log("Couldn't find an error class for the following use-case:");
        console.log(`key: ${key}, message: ${message}`);
        console.log(
          "If you're seeing this error, please make an issue for the customer-fields-api-client-node project in GitLab!",
        );

        throw new MissingCustomerErrorClassError();
      }

      errorClass = ErrorClass as typeof Error;
    });
  });

  return errorClass;
};
