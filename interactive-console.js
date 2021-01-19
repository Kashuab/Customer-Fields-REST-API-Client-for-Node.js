const fs = require('fs');
const { exec } = require('child_process');
const repl = require('repl');

require('dotenv').config({ path: 'examples/.env' });

if (!process.env.CF_PRIVATE_ACCESS_TOKEN) {
  console.log(
    'Missing CF_PRIVATE_ACCESS_TOKEN environment variable. Make sure you have a .env file in the "examples" directory that specifies it.',
  );
  return;
}

(async () => {
  if (!fs.existsSync('./lib')) {
    console.log('Missing lib folder! Building client...');
    await new Promise((resolve, reject) => {
      exec('npm run build').on('exit', (code) => {
        if (code != 0) {
          reject('Failed to build client');
        } else {
          console.log('\n\nDone building client.\n\n');
          resolve();
        }
      });
    });
  }

  globalThis.CF = require('./lib');

  console.log(
    'You can reference the global CF variable to get started.\n',
    'Try running: CF.Customer.find({}).then(([customers]) => console.log(customers.length));\n\n',
  );

  repl.start();
})();
