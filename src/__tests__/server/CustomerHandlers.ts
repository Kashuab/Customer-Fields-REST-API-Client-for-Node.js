import { rest } from 'msw';
import { BasicCustomerDataDict } from '../../models/Customer';
import { generateCustomer } from './data/generateCustomer';
import { sortBy } from 'lodash';

export const customers: BasicCustomerDataDict[] = [];

for (let i = 0; i < 1000; i++) {
  customers.push(generateCustomer());
}

export default [
  rest.get('http://localhost/api/v2/customers/search.json', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '1'),
      limit = parseInt(req.url.searchParams.get('limit') || '25'),
      sortKey = (req.url.searchParams.get('sort_by') as keyof BasicCustomerDataDict) || 'updated_at',
      sortOrder = req.url.searchParams.get('sort_order') || 'desc';

    const pageOfCustomers = customers.slice((page - 1) * limit, page * limit);
    const sortedCustomers = sortBy([...pageOfCustomers], sortKey);

    if (sortOrder == 'desc') sortedCustomers.reverse();

    return res(ctx.json({ customers: sortedCustomers }));
  }),
];
