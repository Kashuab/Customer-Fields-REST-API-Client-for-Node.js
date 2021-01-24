import { Customer } from './models/Customer';
import { DataColumn } from './models/DataColumn';
import { throwIfInBrowser } from './utils/throwIfInBrowser';
import { config } from './utils/config';
import { allErrors as Errors } from './errors/Errors';

throwIfInBrowser();

export { Customer, DataColumn, config, Errors };

export interface CFAPIClient {
  Customer: typeof Customer;
  DataColumn: typeof DataColumn;
  Errors: typeof Errors;
  config: typeof config;
}

const client: CFAPIClient = {
  Customer,
  DataColumn,
  config,
  Errors,
};

export default client;
