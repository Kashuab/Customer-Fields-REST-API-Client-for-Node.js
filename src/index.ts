import { CustomerFieldsAPIClient } from './CustomerFieldsAPIClient';
import { Customer } from './Customer';
import { throwIfInBrowser } from './utils/throwIfInBrowser';

throwIfInBrowser();

export { CustomerFieldsAPIClient, Customer };
export default CustomerFieldsAPIClient;
