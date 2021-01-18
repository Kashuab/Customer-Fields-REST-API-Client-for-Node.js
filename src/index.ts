import { CustomerFieldsAPIClient } from './CustomerFieldsAPIClient';
import { Customer } from './Customer';
import { throwIfInBrowser } from './utils/throwIfInBrowser';
import { config } from './config';

throwIfInBrowser();

export { CustomerFieldsAPIClient, Customer, config };
export default CustomerFieldsAPIClient;
