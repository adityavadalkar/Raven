const { claimIncludes, auth } = require('express-oauth2-jwt-bearer');
const { auth0Config } = require('../../config/vars');

const checkJwt = auth({
  issuerBaseURL: auth0Config.issuerBaseURL,
  audience: auth0Config.audience,
});

const checkAdminPermission = claimIncludes('permissions', 'admin');

module.exports = {
  checkJwt,
  checkAdminPermission,
};
