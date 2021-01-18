import { config } from './config';
import { Customer } from './Customer';
import { dispatchRequest } from './dispatchRequest';

export class CustomerFieldsAPIClient {
  static config = config;
  static Customer = Customer;
  static dispatchRequest = dispatchRequest;
}
