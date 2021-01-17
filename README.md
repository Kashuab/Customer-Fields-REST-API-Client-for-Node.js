# Customer Fields API Client for Node.js

This package is currently experimental, expect multiple breaking changes to occur until the first stable release (version `1.0.0`)

The purpose of this library is to abstract the burden of manually dispatching web requests to the Customer Fields REST API. We want to make the API easier and more accessible for developers, so they can focus on the more important things in software development.

**Do not use this library directly in the browser. Doing so puts customers' data at risk by publicly exposing your private access token.**

Features:

- Intuitive API with `async` functions
- Written in TypeScript for your auto-completion convenience

Coming soon:

- Automatic request retries when a `429 (Too many requests)` status code is returned

## What is Customer Fields?

[Customer Fields](https://apps.shopify.com/customr) (referred to as "CF") is a [Shopify](https://www.shopify.com/) app built by [Helium](https://heliumdev.com/). Using CF, merchants can create forms to collect all kinds of information from their customers during the registration process. We have diverse tools that allow developers to take advantage of our powerful suite of features.

Check out our [developer documentation](https://developers.customerfields.com/) for more information on our Storefront JavaScript tools and REST API.

## Getting started

(This package is currently not available on NPM, the following instructions are placeholders until we have a stable MVP)

Start by installing the module into your project:

`npm install --save customer-fields-api-client`

Or if you prefer `yarn`:

`yarn add customer-fields-api-client`

Here's some example usage:

```typescript
import CF, { config } from 'customer-fields-api-client-node';

// Bonus points: put this environment variable in a .env file instead, and use the dotenv module to load it!
config.privateAccessToken = process.env.CF_PRIVATE_ACCESS_TOKEN;

const customers = await CF.Customer.find({});

customers.forEach(customer => {
  console.log('Check out this customer:', customer.id, customer.shopify_id);
});

const customer = customers[0];

// Assuming you have a properly configured "birthday" data column...
customer.set('birthday', new Date().toISOString());

await customer.save();
```

See more examples [in our `/examples` directory.](examples)

An error will be thrown if `document` is in the `window`. Again, *do not use this library in the browser.*

## Error handling

Many different errors can be thrown as a result of attempts to save bad data. Here's how you can catch them:

```typescript
import { Customer } from 'customer-fields-api-client-node';

const customer = new Customer({
  email: 'some_email_in_use@website.com'
});

try {
  await customer.save();
} catch (err) {
  if (err instanceof Customer.Errors.EmailAlreadyTakenError) {
    console.log('Uh oh!')
  }
}
```

You can explore the `Customer.Errors` object to see what errors you need to handle.

## TypeScript goodness

We've got some awesome typings to make your life easier. Simple problems can get caught before compiling if you're using TypeScript.

For example:

```typescript
const customer = new Customer();

// 1234 is not assignable to type 'string'
customer.set('email', 1234);

const state = customer.get('state');

// 'bad value' is not assignable to type 'disabled' | 'enabled' | 'invited' | 'declined' | 'cf:pending'
if (state == 'bad value') {
  // ...
}

customer.set('default_address', {
  // 'bad_key' does not exist in type 'CustomerAddressDict'
  bad_key: 'Example value',
});
```

## Contributing

Pull requests are always welcome! Start by cloning the repository:

`git clone https://gitlab.com/heliumdev/customer-fields-api-client-node`

`cd customer-fields-api-client-node/`

`yarn`

We use `jest` to run our tests:

`$ yarn test`

Run this command to build the client into the `lib` folder:

`$ yarn build` 

You can then import it from another local project:

```
// ~/some-project/index.ts
import CF from '../customer-fields-api-client-node';

const customer = new CF.Customer({
  first_name: 'John',
  // ...
});
```
