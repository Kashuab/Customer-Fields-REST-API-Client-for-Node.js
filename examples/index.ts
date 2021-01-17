import { listCustomers } from './listCustomers';
import { updateCustomer } from './updateCustomer';
import { createCustomer } from './createCustomer';

// Load your token from environment variables:
import dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/.env` });

// Or configure them directly:
import { config } from '../src/config';
config.privateAccessToken = '<your token>';

(async () => {
  const customers = await listCustomers();
  // Assuming you have a customer in your shop...
  await updateCustomer(customers[0]);
  await createCustomer();
})();
