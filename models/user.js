var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, unique: true ,required: [true, 'Email is required'] },
    password: { type: String, required: [true, 'Email is required'] },
    img: { type: String },
    role: { type: String, required: true, default: 'USER_ROLE' },
});

module.exports = mongoose.model('User', userSchema);