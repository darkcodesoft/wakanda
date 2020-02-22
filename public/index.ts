import App from '../src/bootstrap/app';

/**
 *
 * Get app singleton and process passed arguments to retrieve
 * port number if given.
 */
const app = App.static();
const args = require('minimist')(process.argv.slice(2));

if (args.port) {
  const port = parseInt(args.port);
  app.server.setPort(port);
}

/**
 *
 *
 * Start app
 */
app.start();
