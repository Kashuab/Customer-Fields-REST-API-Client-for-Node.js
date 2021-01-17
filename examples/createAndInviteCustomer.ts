import { Customer } from '../src';

export async function createAndInviteCustomer(): Promise<Customer | undefined> {
  const customer = new Customer({
    first_name: 'John',
    last_name: 'Smith',
    email: 'johnsmith2@website.com',
  });

  try {
    await customer.save();
  } catch (err) {
    if (err instanceof Customer.Errors.EmailAlreadyTakenError) {
      console.error('You must specify an email that is not already in use!');
      return;
    }
  }

  console.log('Customer state before invite:', customer.get('state'));

  await customer.sendInvite();

  console.log('Customer state after invite:', customer.get('state'));

  return customer;
}
