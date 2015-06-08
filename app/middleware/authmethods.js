var User     = require('./../models/user');

var AuthMethods = function(){

  this.isLoggedIn = function (req, res, next) {
    
    if (req.loggedIn){
      console.log(1);
      return next();
    }

    res.send(401, 'Please login!');
  };

  this.isAdmin = function (req, res, next) {

    if (req.user.loggedIn && req.user.type === 'admin')
      return next();

    res.send(403, 'restricted to Admin');
    
  };

}

module.exports = new AuthMethods();

  