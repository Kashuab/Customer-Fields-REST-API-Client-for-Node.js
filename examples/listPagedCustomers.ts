import CF, { Customer } from '../src';
import { PaginatedResponse } from '../src/CustomerFieldsAPIClient';

export async function listPagedCustomers(): Promise<Customer[]> {
  let allCustomers: Customer[] = [];

  let search: () => PaginatedResponse<Customer[]> = () => CF.searchCustomers({}, { limit: 250 });

  while (true) {
    const [customers, pagination] = await search();

    console.log(`Page ${pagination.page} has ${customers.length} customers`);
    allCustomers = allCustomers.concat(customers);

    // On next loop, use query the next page instead.
    if (pagination.next) {
      search = pagination.next;
    } else {
      return allCustomers;
    }
  }
}
