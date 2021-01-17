import { BasicCustomerDataDict, Customer } from './Customer';
import { dispatchRequest } from './dispatchRequest';

/* eslint-disable */
export type PaginatedResponse<T> = Promise<
  [
    T,
    {
      page: number;
      next?: () => PaginatedResponse<T>;
      prev?: () => PaginatedResponse<T>;
    }
  ]
>;
/* eslint-disable */

export class CustomerFieldsAPIClient {
  public static async searchCustomers(
    query: GetCustomersQuery,
    opts?: GetCustomersOpts,
  ): PaginatedResponse<Customer[]> {
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

    const response = await dispatchRequest(path);

    if (!response.ok) {
      console.log(response.status);
      console.log(response.statusText);
      throw new Error('Failed to dispatch customers search request');
    }

    const customers: BasicCustomerDataDict[] = (await response.json()).customers || [];

    const customerInstances = customers.map((customer: Record<string, any>) => {
      return new Customer(customer);
    });

    const canGoToNextPage = customers.length == limit,
      canGoToPreviousPage = page > 1;

    const next = () => CustomerFieldsAPIClient.searchCustomers(query, { ...opts, page: page + 1 });
    const prev = () => CustomerFieldsAPIClient.searchCustomers(query, { ...opts, page: page - 1 });

    return [
      customerInstances,
      {
        page,
        next: canGoToNextPage ? next: undefined,
        prev: canGoToPreviousPage ? prev : undefined,
      },
    ];
  }
}

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
