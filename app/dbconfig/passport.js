// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ $or: [{'username' :  username}, {'email': req.body.email} ]}, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);


            // check to see if theres already a user with that email
            if (user) {
                user.duplicate = true;
                return done(null, user);
            } else {

              // set the user's local credentials
              var user = new User();
              user.username = username;
              user.password = password;
              user.email = req.body.email;
              user.gender = req.body.gender;
              user.userType = req.body.usertype;
              
              user.password = user.generateHash(password);

              console.log(user);

              // save the user
              user.save(function(err) {
                  if (err)
                    return done(err);
                  return done(null, user);
                });
            }

        });    

        });

    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ $or: [{'username' :  username}, {'email': username} ]}, function(err, user) {
            // if there are any errors, return the error
            if (err){
              return done(err);
            }
            console.log(1);
              
            // check to see if theres already a user with that email
            if (! user) {
                return done(null, null, 'authentication failed kwa');
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)){
              return done(null, null, 'authentication failed kwasia');
            }

            return done(null, user);        
          

        });    

        });

    }));

};