var User     = require('./../models/user');

var UtilMethods = function(){
  
  this.createUser = function (req, res, type) {

    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.gender = req.body.gender;
    user.userType = type;

    // create new user and check for errors
    user.save(function(err) {
      if (err)
          res.send(err);

      res.json({ message: 'User created!' });

    });
  }
    
}

module.exports = new UtilMethods();

  