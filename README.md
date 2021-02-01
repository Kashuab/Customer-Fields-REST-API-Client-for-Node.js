# Customer Fields REST API Client for Node.js

This package is currently experimental, expect multiple breaking changes to occur until the first stable release (version `1.0.0`)

The purpose of this library is to mitigate the burden of manually dispatching web requests to the Customer Fields REST API by abstracting it with a simple object-oriented approach. We want to make the API more accessible for developers, so that precious time can be spent more in achieving goals.

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

Before using the client, you need to provide your private access token. There are two ways to do this:

1. Provide a `CF_PRIVATE_ACCESS_TOKEN` environment variable (recommended)

Create an `.env` file with these contents in the root of your project:

```
CF_PRVIATE_ACCESS_TOKEN=your token
```

Then load it using the [`dotenv` module](https://www.npmjs.com/package/dotenv):

```typescript
// Make sure you load the env vars before importing CF
import dotenv from 'dotenv';
dotenv.config();

import CF from 'customer-fields-api-client';
// CF is now ready for use!
```

2. Configure the access token directly

```typescript
import CF from 'customer-fields-api-client';

CF.config.privateAccessToken = 'your token'
```

To generate a private access token, visit the [account page](https://app.customerfields.com/account) in the Customer Fields app.

Now you're ready to start using it. Here's some example usage:

```typescript
// Load the private access token into process.env
import dotenv from 'dotenv';
dotenv.config();

import CF from 'customer-fields-api-client';

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

## Playground

The project includes a script that allows you to experiment with the client in the terminal.

1. Clone this repo and `cd` into it
2. `yarn` (or `npm install`)
3. `yarn icc` or (`npm run icc`)

## Error handling

Many different errors can be thrown as a result of attempts to save bad data. Here's how you can catch them:

```typescript
import CF from 'customer-fields-api-client';

const customer = new CF.Customer({
  email: 'some_email_in_use@website.com'
});

try {
  await customer.save();
} catch (err) {
  if (err instanceof CF.Errors.EmailAlreadyTakenError) {
    console.log('Uh oh!')
  }
}
```

This is very convenient, especially if you need to inform another source of what needs to be corrected (i.e. an account form in another environment)

## TypeScript goodness

We've got some awesome typings to make your life easier. Simple problems can get caught before compiling if you're using TypeScript.

For example:

```typescript
import CF from 'customer-fields-api-client';

const customer = new CF.Customer();

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

Pull requests are always welcome! Start by forking the repository, cloning it, then `cd`ing into it.

Run `yarn test` to make sure everything is set up correctly.

We expect to see unit tests alongside pull requests.

You can find our tests in `src/__tests`. In some cases you may need to mock a server response, see `src/__tests__/server/CustomerHandlers.ts` as a reference. 

Run this command to build the client into the `lib` folder:

`yarn build` 

You can then import it from another local project:

```
// ~/some-project/index.ts
import CF from '../Customer-Fields-REST-API-Client-for-Node.js';

const customer = new CF.Customer({
  first_name: 'John',
  // ...
});
```
