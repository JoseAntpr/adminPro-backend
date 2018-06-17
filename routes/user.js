var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var User =  require('../models/user');


/* 
===========================================
Get all users
===========================================
*/
app.get('/', (req, res, next) => {

    User.find({}, 'name email img rol').exec(
        
        (err, users) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error loading users',
                errors: err
            })
        }

        res.status(200).json({
            ok: true,
            users: users
        });


    });
});

/* 
===========================================
Create a new user
===========================================
*/

app.post('/', (req, res) => {

    var body = req.body;

    var newUser = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    newUser.save((err, savedUser )=> {
        if( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creating user',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            user: savedUser
        })
    });

});

module.exports = app;