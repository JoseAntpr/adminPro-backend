var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();

var User =  require('../models/user');


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
        var token = jwt.sign({ user: user}, '@este-es@-un-seed-dificil', {expiresIn: 14400}); // 4horas

        res.status(200).json({
            ok: true,
            user: user,
            id: user._id,
            token: token
        });

    });

});



module.exports = app;