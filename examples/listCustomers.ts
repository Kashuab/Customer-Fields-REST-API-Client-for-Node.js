import { Customer } from '../src';

export async function listCustomers(): Promise<Customer[]> {
  const [customers] = await Customer.find({});
  console.log(`You have ${customers.length} customers`);

  return customers;
}
