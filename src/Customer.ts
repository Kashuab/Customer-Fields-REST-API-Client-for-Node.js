import { RequestDispatcher, RequestDispatcherInit } from './RequestDispatcher';
import { get, set } from 'lodash';

export class Customer extends RequestDispatcher {
  id?: string;
  data: Partial<BasicCustomerDataDict> & Record<string, any>;

  constructor(data?: Record<string, any>, requestDispatcherInit?: RequestDispatcherInit) {
    super(requestDispatcherInit);

    this.data = data || {};
    this.id = this.data.id;
  }

  get isPending(): boolean {
    return this.get('state') == 'cf:pending';
  }

  set(data: BasicCustomerDataDict): Customer;
  set<K extends BasicCustomerDataDictKey = BasicCustomerDataDictKey>(
    key: K | string,
    value: BasicCustomerDataDict[K],
  ): Customer;
  set(dataOrKey: BasicCustomerDataDict | string, value?: any): Customer {
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

    const response = await this.dispatchRequest(endpoint, {
      method: this.id ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });

    const jsonResponse = await response.json();

    this.set(jsonResponse.customer);

    return this;
  }
}

export type CustomerAddressDict = {
  id: string;
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
  name: string;
  province_code: string;
  country_code: string;
  country_name: string;
  default: boolean;
};

export type BasicCustomerDataDictKey = keyof BasicCustomerDataDict;

export type BasicCustomerDataDict = {
  accepts_marketing: boolean;

  /**
   * ISO-formatted, i.e. `"2020-07-13T12:44:14-05:00"`
   */
  accepts_marketing_updated_at?: string;

  admin_graphql_api_id: string;
  addresses: CustomerAddressDict[];
  default_address?: CustomerAddressDict;
  email: string;
  first_name: string;
  last_name: string;
  multipass_identifier?: string;
  note: string;

  /**
   * E.164 format, i.e. `"+13605402030"`
   */
  phone: string;

  tags: string[];
  tax_exempt: boolean;
  tax_exemptions: string[];
  readonly average_order_amount: number;

  /**
   * Currency in ISO 4217 format, i.e. `"USD"`, `"EUR"`, `"GBP"`, `"JPY"`.
   *
   * See: https://en.wikipedia.org/wiki/ISO_4217
   */
  readonly currency?: string;

  /**
   * ISO-formatted, i.e. `"2020-07-13T12:39:39-05:00"`
   */
  readonly created_at: string;

  readonly id: string;
  readonly last_order_id?: number;
  readonly last_order_name?: string;
  readonly marketing_opt_in_level?: string;
  readonly orders_count: number;
  readonly shopify_id?: number;
  readonly state: 'enabled' | 'invited' | 'declined' | 'disabled' | 'cf:pending';
  readonly total_spent: number;

  /**
   * ISO-formatted, i.e. `"2020-07-13T12:44:14-05:00"`
   */
  readonly updated_at: string;

  readonly verified_email?: boolean;
};

export type CustomerSaveOpts = {
  formId?: string;
};

export type CustomerSaveRequestPayload = {
  customer: Record<string, any>;
  form_id?: string;
};

export type CustomerUpdateOpts = CustomerSaveOpts & {};
export type CustomerUpdateRequestPayload = CustomerSaveRequestPayload & {};

export type CustomerInitOpts = RequestDispatcherInit & {
  data: BasicCustomerDataDict & Record<string, any>;
};
