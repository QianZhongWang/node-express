var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var usersSchema = new Schema({
    "userName":String,
    "passWord":String,
})

module.exports = mongoose.model('User',usersSchema)