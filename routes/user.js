var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var User =  require('../models/user');
/* 
===========================================
Get all users
===========================================
*/
app.get('/', (req, res, next) => {

    var nextPage = req.query.next || 0;
    nextPage = Number(nextPage);

    User.find({}, 'name email img rol')
    .skip(nextPage)
    .limit(5)
    .exec(
        
        (err, users) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error loading users',
                errors: err
            })
        }

        User.count({}, (err, count) => {
            res.status(200).json({
                ok: true,
                users: users,
                total: count
            });

        });

        


    });
});

/* 
===========================================
update an  user
===========================================
*/

app.put('/:id', mdAuthentication.tokenVerify ,(req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById( id, ( err, user ) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error finding the user',
                errors: err
            });
        }

        if( !user ){
            return res.status(400).json({
                ok: false,
                mensaje: 'User with id' + id + 'not found',
                errors: err
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save( (err, savedUser) => {
            if( err ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error updating user',
                    errors: err
                });
            }
            savedUser.password = ':|';
            res.status(200).json({
                ok: true,
                user: savedUser
            })
        });
    });

});

/* 
===========================================
Create a new user
===========================================
*/

app.post('/', mdAuthentication.tokenVerify ,(req, res) => {

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
            });
        }

        res.status(201).json({
            ok: true,
            user: savedUser,
            tokenUsuario: req.user
        });
    });

});


/* 
===========================================
Delete user
===========================================
*/
app.delete('/:id', mdAuthentication.tokenVerify, (req, res) => {
    var id = req.params.id;

    User.findByIdAndRemove(id, (err, deletedUser)=> {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error deleting user',
                errors: err
            });
        }

        if( !deletedUser ){
            return res.status(400).json({
                ok: false,
                mensaje: 'User with ' + id + 'not exists',
                errors: {
                    message: 'User with this id not exists'
                }
            })
        }

        res.status(200).json({
            ok: true,
            usuario: deletedUser
        });
    });
});


module.exports = app;