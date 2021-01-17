import { Customer } from '../src';

export async function createCustomer(): Promise<Customer> {
  const newCustomer = new Customer({
    email: 'kyle+totallynewcustomer@heliumdev.com',
    first_name: 'First name',
    last_name: 'Last name',
  });

  await newCustomer.save();

  console.log('New customer created:', newCustomer.get('id'), newCustomer.get('email'), newCustomer.get('state'));

  return newCustomer;
}
