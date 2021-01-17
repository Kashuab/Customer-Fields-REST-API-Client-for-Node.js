import { dispatchRequest } from './dispatchRequest';
import { get, set } from 'lodash';
import { RequestInit, Response } from 'node-fetch';
import { CustomerErrors, getCustomerError, EmailAlreadyTakenError } from './errors/CustomerErrors';

export type CustomerDataDict = BasicCustomerDataDict & Record<string, any>;

export class Customer {
  id?: string;
  shopifyId?: number;
  data: CustomerDataDict;

  static Errors = {
    EmailAlreadyTakenError,
  };

  static async dispatchRequest(path: string, fetchInit?: RequestInit | undefined): Promise<Response> {
    const response = await dispatchRequest(path, fetchInit);

    if (!response.ok) {
      let errors: CustomerErrors;

      try {
        errors = (await response.json()).errors;
      } catch (err) {
        console.error(err);
        throw new Error(`Failed to dispatch request, received status code ${response.status}: ${response.statusText}`);
      }

      const ErrorClass = getCustomerError(errors);

      if (ErrorClass) {
        throw new ErrorClass();
      }
    }

    return response;
  }

  static async findById(id: string): Promise<Customer | null> {
    const response = await Customer.dispatchRequest(`/customers/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to find customer by ID, receieved error code ${response.status}: ${response.statusText}`);
    }

    const customer = (await response.json()).customer;

    return customer ? new Customer(customer) : null;
  }

  static async find(query: GetCustomersQuery, opts?: GetCustomersOpts): PaginatedResponse<Customer[]> {
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

    const response = await Customer.dispatchRequest(path);

    if (!response.ok) {
      throw new Error(`Failed to find customers, receieved error code ${response.status}: ${response.statusText}`);
    }

    const customers: BasicCustomerDataDict[] = (await response.json()).customers || [];

    const customerInstances = customers.map((customer: Record<string, any>) => {
      return new Customer(customer);
    });

    const canGoToNextPage = customers.length == limit,
      canGoToPreviousPage = page > 1;

    const next = () => Customer.find(query, { ...opts, page: page + 1 });
    const prev = () => Customer.find(query, { ...opts, page: page - 1 });

    return [
      customerInstances,
      {
        page,
        next: canGoToNextPage ? next : undefined,
        prev: canGoToPreviousPage ? prev : undefined,
      },
    ];
  }

  constructor(data?: CustomerDataDict) {
    this.data = data || {};
    this.id = this.data.id;
    this.shopifyId = this.data.shopify_id;
  }

  get isPending(): boolean {
    return this.get('state') == 'cf:pending';
  }

  set(data: BasicCustomerDataDict): Customer;
  set<K extends BasicCustomerDataDictKey = BasicCustomerDataDictKey>(
    key: K | string,
    value: BasicCustomerDataDict[K],
  ): Customer;
  set(dataOrKey: BasicCustomerDataDict | string, value?: unknown): Customer {
    if (typeof dataOrKey == 'string') {
      this.data = set(this.data, dataOrKey, value);
    } else {
      this.data = {
        ...this.data,
        ...dataOrKey,
      };
    }

    return this;
  }

  get<K extends BasicCustomerDataDictKey = BasicCustomerDataDictKey>(key: K): BasicCustomerDataDict[K];
  get(key: string): any;
  get(key: string): any {
    return get(this.data, key);
  }

  async save(opts?: CustomerSaveOpts): Promise<Customer> {
    const payload: CustomerSaveRequestPayload = {
      customer: this.data,
    };

    if (opts?.formId) payload.form_id = opts.formId;

    let endpoint = '/customers';

    if (this.id) {
      endpoint += `/${this.id}`;
    }

    const response = await Customer.dispatchRequest(endpoint, {
      method: this.id ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(await response.text());
      throw new Error(`Failed to save customer, receieved error code ${response.status}: ${response.statusText}`);
    }

    const customer: CustomerDataDict = (await response.json()).customer;

    this.id = customer.id;
    this.shopifyId = customer.shopify_id;
    this.set(customer);

    return this;
  }

  async sendInvite(): Promise<Customer> {
    if (!this.id) {
      throw new Error('Customer must have an ID before sending an invite');
    }

    if (!this.shopifyId) {
      throw new Error('Customer must have a shopify ID before sending an invite');
    }

    const response = await Customer.dispatchRequest(`/customers/${this.id}/invite`, { method: 'POST' });
    if (!response.ok) {
      throw new Error(
        `Failed to send invite to customer, receieved error code ${response.status}: ${response.statusText}`,
      );
    }

    return this;
  }
}

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

export type CustomerAddressDict = {
  id?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
  name?: string;
  province_code?: string;
  country_code?: string;
  country_name?: string;
  default?: boolean;
};

export type BasicCustomerDataDictKey = keyof BasicCustomerDataDict;

export type BasicCustomerDataDict = {
  accepts_marketing?: boolean;

  /**
   * ISO-formatted, i.e. `"2020-07-13T12:44:14-05:00"`
   */
  accepts_marketing_updated_at?: string;

  admin_graphql_api_id?: string;
  addresses?: CustomerAddressDict[];
  default_address?: CustomerAddressDict;
  email?: string;
  first_name?: string;
  last_name?: string;
  multipass_identifier?: string;
  note?: string;

  /**
   * E.164 format, i.e. `"+13605402030"`
   */
  phone?: string;

  tags?: string[];
  tax_exempt?: boolean;
  tax_exemptions?: string[];
  readonly average_order_amount?: number;

  /**
   * Currency in ISO 4217 format, i.e. `"USD"`, `"EUR"`, `"GBP"`, `"JPY"`.
   *
   * See: https://en.wikipedia.org/wiki/ISO_4217
   */
  readonly currency?: string;

  /**
   * ISO-formatted, i.e. `"2020-07-13T12:39:39-05:00"`
   */
  readonly created_at?: string;

  readonly id?: string;
  readonly last_order_id?: number;
  readonly last_order_name?: string;
  readonly marketing_opt_in_level?: string;
  readonly orders_count?: number;
  readonly shopify_id?: number;
  readonly state?: 'enabled' | 'invited' | 'declined' | 'disabled' | 'cf:pending';
  readonly total_spent?: number;

  /**
   * ISO-formatted, i.e. `"2020-07-13T12:44:14-05:00"`
   */
  readonly updated_at?: string;

  readonly verified_email?: boolean;
};

export type CustomerSaveOpts = {
  formId?: string;
};

export type CustomerSaveRequestPayload = {
  customer: Record<string, any>;
  form_id?: string;
};

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
