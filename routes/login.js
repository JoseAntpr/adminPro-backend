var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var User =  require('../models/user');

// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

/* 
===========================================
Autenticacion google
===========================================
*/
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });


    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}

app.post('/google', async (req, res) => {

    var token = req.body.token;
    var googleUser = await verify( token )
        .catch( e => {
            return res.status(200).json({
                ok: false,
                mensaje: 'Invalid token'
            });
        });

    res.status(200).json({
        ok: true,
        mensaje: 'Ok',
        googleUser: googleUser
    });
});

/* 
===========================================
Autenticación normal
===========================================
*/
app.post('/', (req, res)=> {

    var body = req.body;

    User.findOne({ email: body.email }, (err, user) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error searching user'
            });
        }

        if( !user ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credentials not valid - email'
            });
        }

        if( !bcrypt.compareSync( body.password, user.password) ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credentials not valid - password'
            });
        }

        // Create token
        user.password = ':@';
        var token = jwt.sign({ user: user}, SEED , {expiresIn: 14400}); // 4horas

        res.status(200).json({
            ok: true,
            user: user,
            id: user._id,
            token: token
        });

    });

});



module.exports = app;