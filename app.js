// Requires
var express = require('express');
var mongoose = require('mongoose');


// Initialize variables
var app = express();

//Importar rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');

// Conection with db
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if( err ) throw err;

    console.log('Database is \x1b[32m%s\x1b[0m', 'running');
});

// Rutas
app.use('/', appRoutes);
app.use('/user', userRoutes);


// Listen petitions
app.listen(3000, () => {
    console.log('Server is \x1b[32m%s\x1b[0m in http://localhost:3000', 'running');
});