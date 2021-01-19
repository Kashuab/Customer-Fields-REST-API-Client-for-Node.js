const repl = require('repl');

require('dotenv').config({ path: 'examples/.env' });

if (!process.env.CF_PRIVATE_ACCESS_TOKEN) {
  console.log(
    'Missing CF_PRIVATE_ACCESS_TOKEN environment variable. Make sure you have a .env file in the "examples" directory that specifies it.',
  );
  return;
}

globalThis.CF = require('./lib');

console.log(
  'You can reference the global CF variable to get started.\n',
  'Try running: CF.Customer.find({}).then(([customers]) => console.log(customers.length));\n\n',
);
repl.start();
