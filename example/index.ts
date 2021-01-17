import CF, { Customer } from '../src';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/.env` });

const cf = new CF();

async function listCustomers(): Promise<Customer[]> {
  const customers = await cf.searchCustomers({});
  console.log(`You have ${customers.length} customers`);

  return customers;
}

async function updateCustomer(customer: Customer) {
  // Assuming you have a properly configured "birthday" data column...
  customer.set('birthday', new Date().toISOString());

  await customer.save();

  console.log('Customer birthday:', customer.get('email'), customer.get('birthday'));
}

async function createCustomer(): Promise<Customer> {
  const newCustomer = new Customer({
    email: 'kyle+totallynewcustomer@heliumdev.com',
    first_name: 'First name',
    last_name: 'Last name',
  });

  await newCustomer.save();

  console.log('New customer created:', newCustomer.get('id'), newCustomer.get('email'), newCustomer.get('state'));

  return newCustomer;
}

(async () => {
  const customers = await listCustomers();
  const updatedCustomer = await updateCustomer(customers[0]);
  const newCustomer = await createCustomer();
})();
