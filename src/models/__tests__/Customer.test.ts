import { Customer } from '../Customer';

describe('Customer', (): void => {
  test('can initialize', (): void => {
    let customer = new Customer();

    expect(customer.data).toEqual({});
    expect(customer.id).toBeUndefined();
    expect(customer.shopifyId).toBeUndefined();

    const data = {
      id: 'jf4389hf98ajsdkjhfal348fh9',
      shopify_id: 1234,
    };

    customer = new Customer(data);

    expect(customer.data).toEqual(data);
    expect(customer.id).toBe(data.id);
    expect(customer.shopifyId).toBe(data.shopify_id);
  });

  test('can set data', (): void => {
    const customer = new Customer();

    customer.set('first_name', 'Wednesday');
    customer.set('favorite_number', 1234);
    customer.set('accepts_marketing', true);
    customer.set('optional_key', null);
    customer.set({ this_is_an: 'object', with_many_keys: true });

    expect(customer.data.first_name).toBe('Wednesday');
    expect(customer.data.favorite_number).toBe(1234);
    expect(customer.data.accepts_marketing).toBe(true);
    expect(customer.data.optional_key).toBe(null);
    expect(customer.data.this_is_an).toBe('object');
    expect(customer.data.with_many_keys).toBe(true);
  });

  test('can get data', (): void => {
    const customer = new Customer({ first_name: 'customer' });

    expect(customer.get('first_name')).toBe('customer');
  });

  test('can determine if the customer is pending', (): void => {
    const pendingCustomer = new Customer({ state: 'cf:pending' });
    expect(pendingCustomer.isPending).toBe(true);

    const enabledCustomer = new Customer({ state: 'enabled' });
    expect(enabledCustomer.isPending).toBe(false);
  });

  test('can determine if the customer has been denied', (): void => {
    const deniedCustomer = new Customer({ state: 'cf:denied' });
    expect(deniedCustomer.isDenied).toBe(true);

    const invitedCustomer = new Customer({ state: 'invited' });
    expect(invitedCustomer.isDenied).toBe(false);
  });

  test('can list customers', async (): Promise<void> => {
    const [customers] = await Customer.find({}, { limit: 25 });

    expect(customers.length).toBe(25);
  });
});
