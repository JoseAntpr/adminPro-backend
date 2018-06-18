var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


/* 
===========================================
Token verify
===========================================
*/
exports.tokenVerify = function(req, res, next){

    var token = req.query.token;

    jwt.verify( token, SEED, ( err, decoded) => {

        if( err ) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Unathorized token',
                errors: err
            });
        }

        req.user = decoded.user;

        next();
        

    });

}
