// Load your token from environment variables:
import dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/.env` });

import { listCustomers } from './listCustomers';
import { updateCustomer } from './updateCustomer';
import { createCustomer } from './createCustomer';
import { listPagedCustomers } from './listPagedCustomers';
import { createAndInviteCustomer } from './createAndInviteCustomer';
import { listDataColumns } from './listDataColumns';

/*
  Or uncomment this and configure them directly:

  import { config } from '../src';
  config.privateAccessToken = '<your token>';
*/

(async () => {
  const customers = await listCustomers();
  // Assuming you have a customer in your shop...
  await updateCustomer(customers[0]);
  await createCustomer();
  await createAndInviteCustomer();
  await listDataColumns();
  await listPagedCustomers();
})();
