var express = require('express');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var Doctor = require('../models/doctor');

/* 
===========================================
Get all doctors
===========================================
*/

app.get('/', (req, res, next) => {

    var nextPage = req.query.next || 0;
    nextPage = Number(nextPage);

    Doctor.find({})
    .skip(nextPage)
    .limit(5)
    .populate('user', 'name email')
    .populate('hospital')
    .exec(
        
        (err, doctors) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error loading doctors',
                errors: err
            })
        }

        Doctor.count({}, (err, count) => {

            res.status(200).json({
                ok: true,
                doctors: doctors,
                total: count
            });

        });

        


    });
});

/* 
===========================================
update a doctor
===========================================
*/

app.put('/:id', mdAuthentication.tokenVerify ,(req, res) => {

    var id = req.params.id;
    var body = req.body;

    Doctor.findById( id, ( err, doctor ) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error finding the doctor',
                errors: err
            });
        }

        if( !doctor ){
            return res.status(400).json({
                ok: false,
                mensaje: 'User with id' + id + 'not found',
                errors: err
            });
        }

        doctor.name = body.name;
        doctor.img = body.img;
        doctor.user = req.user._id;
        doctor.hospital = body.hospital;


        doctor.save( (err, savedDoctor) => {
            if( err ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error updating doctor',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                user: savedDoctor
            })
        });
    });

});

/* 
===========================================
Create a new doctor
===========================================
*/

app.post('/', mdAuthentication.tokenVerify ,(req, res) => {

    var body = req.body;

    var newDoctor = new Doctor({
        name: body.name,
        img: body.img,
        user: req.user._id,
        hospital: body.hospital
    });

    newDoctor.save((err, savedDoctor )=> {
        if( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creating doctor',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            doctor: savedDoctor,
        });
    });

});


/* 
===========================================
Delete Doctor
===========================================
*/
app.delete('/:id', mdAuthentication.tokenVerify, (req, res) => {
    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, deletedDoctor)=> {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error deleting doctor',
                errors: err
            });
        }

        if( !deletedDoctor ){
            return res.status(400).json({
                ok: false,
                mensaje: 'doctor with ' + id + 'not exists',
                errors: {
                    message: 'doctor with this id not exists'
                }
            })
        }

        res.status(200).json({
            ok: true,
            doctor: deletedDoctor
        });
    });
});

module.exports = app;