var express = require('express');

var app = express();

var Hospital =  require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');


/* 
===========================================
Search all
===========================================
*/

app.get('/all/:search', (req, res, next) => {

    var search = req.params.search;

    var regex = new RegExp( search, 'i');

    Promise.all( [ 
            searchHospitals(search, regex),
            searchDoctors(search, regex),
            searchUser(search, regex )])
        .then( responses => {
            res.status(200).json({
                ok: true,
                hospitals: responses[0],
                doctors: responses[1],
                users: responses[2]
            });
        });


});

function searchHospitals( search, regex) {

    return new Promise( (resolve, reject )=> {

        Hospital.find({ name: regex })
        .populate('user', 'name email img')
        .exec(
         (err, hospitals) => {
            if( err ){
                reject('Error loading hospitals');
            }
            resolve(hospitals);
        });

    });
    
}

function searchDoctors( search, regex) {

    return new Promise( (resolve, reject )=> {

        Doctor.find({ name: regex }, (err, doctors) => {
            if( err ){
                reject('Error loading hospitals');
            }
            resolve(doctors);
        });

    });
}

function searchUser( search, regex) {

    return new Promise( (resolve, reject )=> {

        User.find({}, 'name email role img')
            .or([{'name': regex}, {'email': regex}])
            .exec( (err, users) => {
                if(err){
                    reject(err);
                }else{
                    resolve(users);
                }
            });

    });
}


/* 
===========================================
Search  by collection
===========================================
*/

app.get('/collection/:table/:search', (req, res, next) => {

    var search =  req.params.search;
    var table = req.params.table;

    var regex = new RegExp( search, 'i');

    var promise;

    switch( table ){
        case 'users':
            promise = searchUser( search, regex );
            break;
        case 'doctors':
            promise = searchDoctors( search, regex );
            break;
        case 'hospitals':
            promise = searchHospitals( search, regex );
            break;
        default: 
            return res.status(400).json({
                ok: false,
                mensaje: 'Searchs type must be users, doctors & hospitals',
                error: { mensaje: 'Collection type not exist'}
            });
    }

    promise.then( data => {

        return res.status(200).json({
            ok: true,
            [table]: data
        });

    });

});


module.exports = app;