export class MissingCustomerErrorClassError extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'MissingCustomerErrorClassError';

    console.log(
      "If you're seeing this error, please make an issue for the customer-fields-api-client-node project in GitLab!",
    );
  }
}

export class EmailAlreadyTakenError extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'EmailAlreadyTakenError';
  }
}

export type CustomerErrors = {
  email: ['has already been taken'];
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
  },
};

export const getCustomerError = (errors: CustomerErrors): typeof Error | undefined => {
  let errorClass: typeof Error | undefined;
  const keys: (keyof CustomerErrors)[] = Object.keys(errors) as (keyof CustomerErrors)[];

  keys.forEach((key) => {
    const errorMessages = errors[key];

    errorMessages.forEach((message) => {
      const ErrorClass = customerErrorToClassMap[key][message];
      if (!ErrorClass) throw new MissingCustomerErrorClassError();

      errorClass = ErrorClass as typeof Error;
    });
  });

  return errorClass;
};
