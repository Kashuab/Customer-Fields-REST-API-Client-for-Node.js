import { rest } from 'msw';
import { BasicCustomerDataDict, CustomerSaveRequestPayload } from '../../models/Customer';
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
  rest.post('http://localhost/api/v2/customers', (req, res, ctx) => {
    const { customer, form_id } = req.body as CustomerSaveRequestPayload;

    const updatedCustomer: BasicCustomerDataDict = {
      ...customer,
      id: generateRandomString(),
      shopify_id: generateRandomNumber(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      state: 'disabled',
      _$form_ids: form_id ? [...(customer._$form_ids || []), form_id] : customer._$form_ids,
    };

    return res(ctx.json({ customer: updatedCustomer }));
  }),
  rest.put('http://localhost/api/v2/customers/:id', (req, res, ctx) => {
    const { customer, form_id } = req.body as CustomerSaveRequestPayload;

    const updatedCustomer: BasicCustomerDataDict = {
      ...customer,
      updated_at: new Date().toISOString(),
      _$form_ids: form_id ? [...(customer._$form_ids || []), form_id] : customer._$form_ids,
    };

    return res(ctx.json({ customer: updatedCustomer }));
  }),
];

export const generateRandomString = (): string => Math.random().toString(36).substring(2);
export const generateRandomNumber = (length = 12): number =>
  parseInt(Math.random().toFixed(length).toString().substring(2));
