import { Customer } from '../src';

export async function updateCustomer(customer: Customer): Promise<Customer> {
  // Assuming you have a properly configured "birthday" data column...
  customer.set('birthday', new Date().toISOString());

  await customer.save();

  console.log('Customer birthday:', customer.get('email'), customer.get('birthday'));

  return customer;
}
