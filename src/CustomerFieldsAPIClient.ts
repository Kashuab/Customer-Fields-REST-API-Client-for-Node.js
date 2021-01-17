import { Customer } from './Customer';
import { RequestDispatcher, RequestDispatcherInit } from './RequestDispatcher';

export type CustomerFieldsAPIClientOpts = RequestDispatcherInit & {};

export type GetCustomersQuery = {
  /**
   * The ID of a customer
   */
  id?: string;

  /**
   * The Shopify ID of a customer
   */
  shopify_id?: number;

  /**
   * The email of a customer
   */
  email?: string;

  /**
   * The phone number of a customer (international format)
   */
  phone?: string;
};

export type GetCustomersOpts = {
  /**
   * The page to view, defaults to `1`
   */
  page?: number;

  /**
   * The total amount of customers to display per page.
   * Minimum is `25`, maximum is `250`.
   * Default limit is `25`.
   */
  limit?: number;

  /**
   * How to sort the customers, acceptable values are "updated_at", "created_at", and "email"
   *
   * Defaults to `"updated_at"`
   */
  sortBy?: 'updated_at' | 'created_at' | 'email';

  /**
   * "desc" or "asc", defaults to `"desc"`
   */
  sortOrder?: 'desc' | 'asc';

  /**
   * Filters the returned customers by those who have submitted a form with this ID
   */
  formId?: string;
};

export class CustomerFieldsAPIClient extends RequestDispatcher {
  constructor(opts?: CustomerFieldsAPIClientOpts) {
    super(opts);
  }

  public async getCustomers(query: GetCustomersQuery, opts?: GetCustomersOpts): Promise<Customer[]> {
    const page = opts?.page || 1,
      limit = opts?.limit || 25,
      sortBy = opts?.sortBy || 'updated_at',
      sortOrder = opts?.sortOrder || 'desc';

    let path = `/customers/search.json?page=${page}&limit=${limit}&sort_by=${sortBy}&sort_order=${sortOrder}`;

    if (opts?.formId) path += `&form_id=${opts.formId};`;

    Object.keys(query).forEach((key) => {
      const value = query[key as keyof GetCustomersQuery];

      path += `&${key}=${value}`;
    });

    const response = await this.dispatchRequest(path);
    const customers = (await response.json()).customers || [];

    return customers.map((customer: Record<string, any>) => {
      return new Customer({
        privateAccessToken: this.privateAccessToken,
        apiUrl: this.apiUrl,
        myshopifyDomain: this.myshopifyDomain,
        data: customer,
      });
    });
  }
}
