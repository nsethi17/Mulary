//temp user
  
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  email: String,
  password: String,
  GENERATED_VERIFYING_URL: String
});



module.exports = mongoose.model('temp_users', userSchema);