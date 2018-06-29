var express = require('express');
var fileUpload = require('express-fileupload');

var app = express();

//default options
app.use(fileUpload());

app.put('/', (req, res, next) => {

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
    



    res.status(200).json({
        ok: true,
        mensaje: 'Ok',
        ext: fileExt
    });
});

module.exports = app;