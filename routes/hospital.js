var express = require('express');

var mdAuthentication = require('../middlewares/authentication').tokenVerify;

var app = express();

var Hospital = require('../models/hospital');

/* 
===========================================
Get all hospitals
===========================================
*/

app.get('/', (req, res, next) => {
    
    var nextPage = req.query.next || 0;
    nextPage = Number(nextPage);


    Hospital.find({})
    .skip(nextPage)
    .limit(5)
    .populate('user', 'name email')
    .exec(
        (err, hospitals) => {
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error loading hospitals',
                    errors: err
                })
            };

            Hospital.count({}, (err, count) => {

                res.status(200).json({
                    ok: true,
                    hospitals: hospitals,
                    total: count
                });

            });

            
        }

    );
});

/* 
===========================================
update an  hospital
===========================================
*/
app.put('/:id', mdAuthentication ,(req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById( id, (err, hospital) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error finding the hospital',
                errors: err
            });
        }

        if( !hospital ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Hospital with id' + id + 'not found',
                errors: err
            });
        }

        hospital.name = body.name;
        hospital.img = body.img;
        hospital.user = body.user;

        hospital.save(( err, savedHospital) => {
            if( err ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error updating hospital',
                    errors: err
                });  
            }
            res.status(200).json({
                ok: true,
                user: savedHospital
            });
        });
    });

});

/* 
===========================================
Create a new hospital
===========================================
*/

app.post('/',mdAuthentication, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        img: body.img,
        user: body.user

    });

    hospital.save((err, savedHospital) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creating hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospital
        });

    });

});

/* 
===========================================
Delete hospital
===========================================
*/

app.delete('/:id', mdAuthentication, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, ( err, deletedHospital) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error deleting hospital',
                errors: err
            });
        }

        if( !deletedHospital ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Hospital with ' + id + 'not exists',
                errors: {
                    message: 'Hospital with this id not exists'
                }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: deletedHospital
        });
    });

});

module.exports = app;