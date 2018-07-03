var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var User = require('../models/user');
var Doctor = require('../models/doctor');
var Hospital = require('../models/hospital');

//default options
app.use(fileUpload());

app.put('/:type/:id', (req, res, next) => {

    var type = req.params.type;
    var id = req.params.id;

    // Collections types
    var validTypes = ['hospitals', 'doctors', 'users'];

    if( validTypes.indexOf(type) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Type is not valid',
            errors: { mensaje: 'Type must be'+ validTypes.join(', ')}
        });
    }

    if( !req.files ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Not image selected',
            errors: { mensaje: 'Mus be select an image'}
        });
    }

    // Get file name
    var file = req.files.image;
    var fileSplit = file.name.split('.');
    var fileExt = fileSplit[ fileSplit.length -1 ];

    // valid Image extension
    var validImageExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if( validImageExtensions.indexOf( fileExt) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Image extension not valid',
            errors: { mensaje: 'Valid extension are ... ' + validImageExtensions.join(', ')}
        });
    }

    // custom file name
    var fileName = `${ id }-${ new Date().getMilliseconds() }.${fileExt}`;

    // Move file to path
    var path = `./uploads/${ type }/${ fileName }`;
    

    file.mv( path, (err) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error moving file',
                errors: err
            });
        } 
    });

    uploadByType(type, id, fileName, res);



    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'File moved',
    //     ext: fileExt
    // });
});

function uploadByType( type, id, fileName, res){

    if( type === 'users'){

        User.findById( id, (err, user) => {

            if( !user ){
                res.status(400).json({
                    ok: false,
                    mensaje: 'hospital not exists',
                });
            }
            var oldPath = './uploads/users/' + user.img;

            // If Image exist then ... delete it
            if( fs.existsSync(oldPath)) {
                fs.unlink( oldPath);
            }

            user.img = fileName;

            user.save(( err, updatedUser ) => {

                updatedUser.password = ':|';
                res.status(200).json({
                    ok: true,
                    mensaje: 'User image updated',
                    user: updatedUser
                });
            });
        });
    }

    if( type === 'hospitals'){

        Hospital.findById( id, (err, hospital) => {
            if( !hospital ){
                res.status(400).json({
                    ok: false,
                    mensaje: 'hospital not exists',
                });
            }
            var oldPath = './uploads/hospitals/' + hospital.img;

            // If Image exist then ... delete it
            if( fs.existsSync(oldPath)) {
                fs.unlink( oldPath);
            }

            hospital.img = fileName;

            hospital.save(( err, updatedHopspital ) => {

                res.status(200).json({
                    ok: true,
                    mensaje: 'hospital image updated',
                    hospital: updatedHopspital
                });
            });
        });
    }

    if( type === 'doctors'){
        Doctor.findById( id, (err, doctor) => {

            if( !doctor ){
                res.status(400).json({
                    ok: false,
                    mensaje: 'doctor not exists',
                });
            }

            if(doctor.img){
                var oldPath = './uploads/doctors/' + doctor.img;
            }
            

            // If Image exist then ... delete it
            if( fs.existsSync(oldPath)) {
                fs.unlink( oldPath);
            }

            doctor.img = fileName;

            doctor.save(( err, updatedDoctor ) => {

                res.status(200).json({
                    ok: true,
                    mensaje: 'User image updated',
                    doctor: updatedDoctor
                });
            });
        });

    }
    
}

module.exports = app;