var User     = require('./../models/user');

var AuthMethods = function(){

  this.isLoggedIn = function (req, res, next) {
    
    if (req.user){
      
      return next();
    }

    res.send(401, 'Please login!');
  };

  this.isAdmin = function (req, res, next) {
    console.log(20,req.user.username, req.user.userType);
    if (req.user && req.user.userType === 'admin')
      return next();

    res.send(403, 'restricted to Admin');
    
  };

}

module.exports = new AuthMethods();

  