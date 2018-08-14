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

/* 
===========================================
Token Admin verify
===========================================
*/
exports.tokenAdminVerify = function(req, res, next){

    var user = req.user;

    if( user.role === 'ADMIN_ROLE'){
        next();
        return;
    }else {

        return res.status(401).json({
            ok: false,
            mensaje: 'Unathorized token',
            errors: err
        });
    }
}

/* 
===========================================
Token Admin verify
===========================================
*/
exports.tokenAdminSameUserVerify = function(req, res, next){

    var user = req.user;
    var id = req.params.id;

    if( user.role === 'ADMIN_ROLE' || user._id === id){
        next();
        return;
    }else {

        return res.status(401).json({
            ok: false,
            mensaje: 'Unathorized token',
            errors: err
        });
    }
}
