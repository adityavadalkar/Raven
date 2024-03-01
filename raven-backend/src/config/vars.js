const path = require('path');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../env/.env.example'),
});

const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;
const mongo_host = process.env.MONGO_HOST;
const mongo_dbname = process.env.MONGO_DBNAME;

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  googleApiKey: process.env.GOOGLE_PLACE_API_KEY,
  mongo: {
    uri:
      process.env.NODE_ENV === 'local'
        ? `mongodb://localhost:27017/${mongo_dbname}`
        : `mongodb+srv://${mongo_username}:${mongo_password}@${mongo_host}/${mongo_dbname}?retryWrites=true&w=majority`,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  auth0Config: {
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  },
};
