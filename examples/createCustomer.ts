import { Customer } from '../src';

export async function createCustomer(): Promise<Customer | undefined> {
  const newCustomer = new Customer({
    email: 'kyle+totallynewcustomer@heliumdev.com',
    first_name: 'First name',
    last_name: 'Last name',
  });

  try {
    await newCustomer.save();
  } catch (err) {
    // Easy error handling!
    if (err instanceof Customer.Errors.EmailAlreadyTakenError) {
      console.error('You must specify an email that is not already in use!');
      return;
    }
  }

  console.log('New customer created:', newCustomer.get('id'), newCustomer.get('email'), newCustomer.get('state'));

  return newCustomer;
}
