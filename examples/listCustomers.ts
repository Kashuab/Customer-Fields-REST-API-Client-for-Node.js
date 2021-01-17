import CF, { Customer } from '../src';

export async function listCustomers(): Promise<Customer[]> {
  const customers = await CF.searchCustomers({});
  console.log(`You have ${customers.length} customers`);

  return customers;
}
