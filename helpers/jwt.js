const { expressjwt: expressjwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ["GET","POST", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/users(.*)/, methods: ["GET", "OPTIONS"] },
      {url:`${api}/users/login`, methods:['POST', 'OPTIONS']},
      {url:`${api}/users/register`, methods:['POST', 'OPTIONS']},
    //   `${api}/users/register`,
    ],
  });
}
async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        done(null, true)
    }
    done();
}

module.exports = authJwt;
