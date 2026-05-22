const serverless = require('serverless-http');
const app = require('../../server/index.cjs');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Rewrite Netlify's internal path back to what Express expects
  event.path = event.path.replace('/.netlify/functions/api', '/api');
  return await handler(event, context);
};
