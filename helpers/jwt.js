const { expressjwt: expressjwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
    const api = process.env.API_URL;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
    //   { url: `${api}/login`, methods: ["GET", "OPTIONS"] },
    //   { url: `${api}/register`, methods: ["POST", "OPTIONS"] },
    ],
  });
}

module.exports = authJwt;
