const { expressjwt: expressjwt }   = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;

    return expressjwt({
        secret,
        algorithms:['HS256']
    }).unless({
        path:[
            '/api/v1/users/login',
            '/api/v1/users/register'

        ]
    })
}

module.exports = authJwt