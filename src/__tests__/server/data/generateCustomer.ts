import { BasicCustomerDataDict, CustomerAddressDict, CustomerState } from '../../../models/Customer';
import faker from 'faker';

const flipCoin = () => Math.round(Math.random()) == 0;

export const generateCustomer = (): BasicCustomerDataDict => {
  const defaultAddress = generateAddress({ default: true });
  const addresses = [generateAddress(), defaultAddress];

  return {
    accepts_marketing: faker.random.boolean(),
    accepts_marketing_updated_at: faker.date.past().toISOString(),
    addresses,
    default_address: defaultAddress,
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    note: faker.random.words(),
    phone: generatePhone(),
    tags: faker.random.words().split(' '),
    tax_exempt: faker.random.boolean(),
    tax_exemptions: [],
    average_order_amount: faker.random.number(),
    currency: generateCurrency(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    orders_count: faker.random.number(),
    shopify_id: generateShopifyCustomerId(),
    state: generateState(),
    verified_email: faker.random.boolean(),
    total_spent: faker.random.number(),
  };
};

export const generateAddress = (overrides?: Partial<CustomerAddressDict>): CustomerAddressDict => {
  const firstName = faker.name.firstName(),
    lastName = faker.name.lastName(),
    name = `${firstName} ${lastName}`;

  return {
    id: `${generateShopifyCustomerId()}`,
    first_name: firstName,
    last_name: lastName,
    name,
    company: faker.company.companyName(),
    address1: faker.address.streetAddress(),
    address2: flipCoin() ? faker.address.secondaryAddress() : undefined,
    city: faker.address.city(),
    province: faker.address.state(),
    country: faker.address.country(),
    zip: faker.address.zipCode(),
    phone: generatePhone(),
    province_code: faker.address.stateAbbr(),
    country_code: faker.address.countryCode(),
    default: faker.random.boolean(),
    ...overrides,
  };
};

export const generatePhone = (): string => `+1${faker.phone.phoneNumberFormat().replace(/-/g, '')}`;
export const generateCurrency = (): string => ['USD', 'EUR', 'GBP', 'JPY'][Math.floor(Math.random() * 4)];
export const generateState = (): CustomerState =>
  ['enabled', 'invited', 'declined', 'disabled', 'cf:pending', 'cf:denied'][
    Math.floor(Math.random() * 6)
  ] as CustomerState;

export const generateRandomString = (): string => Math.random().toString(36).substring(2);
export const generateRandomNumber = (length: number): number =>
  parseInt(Math.random().toFixed(length).toString().substring(2));

export const generateShopifyCustomerId = (): number => generateRandomNumber(13);
