var User     = require('./models/user');
var Post     = require('./models/post');
var Categories     = require('./models/categories');
var Tag     = require('./models/tag');
var AuthMethods = require('./middleware/authmethods');
var UtilMethods = require('./middleware/utils');

// expose the routes to our app with module.exports
module.exports = function(router,passport) {
    
  // middleware to use for all requests
  router.use(function(req, res, next) {

      // do logging
      console.log('Something is happening.');
      next(); // make sure we go to the next routes and don't stop here
  }); 
  
  // on routes that end in /signup
  // ----------------------------------------------------
  router.route('/signup')

    // create a new user if there is no existing user with same username
    .post(function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (user.duplicate) {
          return res.send(401,{ success : false, message : 'Same username found!' });
        }else{

          user.loggedIn = true;
          req.login(user, function(err){
            if(err){
              return next(err);
            }

            return res.send({ success : true, message : 'User successfully registered!' });        
          });
        }
      }
    )(req, res, next);
  }); 
        
   

  router.route('/adminsignup')

    // create a new user if there is no existing user with same username
    .post(AuthMethods.isAdmin, function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (user.duplicate) {
          return res.send(401,{ success : false, message : 'Same username found!' });
        }else{
            
            return res.send({ success : true, message : 'User successfully registered!' });        
        
        }
    })(req, res, next);
  });


  // on routes that end in /signup
  // ----------------------------------------------------
  router.route('/logout')

    // create a new user if there is no existing user with same username
    .post(function(req, res, next) {
      req.user = {};
      return res.send({ success : true, message : 'User logged out!' });   
    }); 


    
  router.route('/login')

    // create a new user if there is no existing user with same username
    .post(function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
        if (err) {

          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (!user) {
          return res.send(401, 'Authentication failed!');
        }else{
          user.loggedIn = true;
          req.login(user, function(err){
            if(err){
              return next(err);
            }
            return res.send({ success : true, message : 'User logged in!' });        
          });
        }
      }
    )(req, res, next);
  }); 

    router.route('/tricks')
    
      // Get all tricks posted
      .get(function(req, res) {

        // Load all posts
        Post.find(function(err, posts) {

          if (err)
            res.send(err);

          res.json(posts);
        });

      });

    router.route('/tricks/categories')
  
      // Get all the categories
      .get(function(req, res) {
        Categories.find(function(err, categories) {
          if (err)
            res.send(err);
          
          res.json(categories);
        });

    });

    router.route('/tricks/categories/:category_name')
  
      // Get all tricks posted for a category
      .get(function(req, res) {
        Post.find({category: req.params.category_name}, function(err, posts) {
          if (err)
            res.send(err);

          res.json(posts);
      });

    });

    router.route('/tricks/tags')
  
      // Get all the categories
      .get(function(req, res) {
        Tag.find(function(err, tags) {
          if (err)
            res.send(err);
          
          res.json(tags);
        });

    });

    router.route('/tricks/tags/:tag_name')
  
      // Get all tricks posted for a category
      .get(function(req, res) {
        Post.find({tag: req.params.tag_name}, function(err, posts) {
          if (err)
            res.send(err);

          res.json(posts);
        });

      });

    router.route('/tricks/create')

    // login user
    .post(AuthMethods.isLoggedIn, function(req, res) {
      
      var post = new Post();

      post.postedBy = req.userName;
      post.title = req.body.title;
      post.text = req.body.text;
      post.description = req.body.description;
      post.category = req.body.category;
      post.tag = req.body.tag;

      post.save(function(err, postedData) {
        if (err)
            res.send(err);
        req.postId = postedData._id;

        res.json({ message: 'Post created!' });
      });
    });

    router.route('/tricks/:post_id/comments/create')

    // create trick by a logged in user
    .post(AuthMethods.isLoggedIn, function(req, res) {

      Post.findByIdAndUpdate(
       req.params.post_id,
       { $push: {"comments": req.body}},
       {  safe: true, upsert: true},
         function(err, model) {
          if(err){
            return res.send(err);
          }
            return res.json({message: 'Comment posted!'});
        });
      
    });

    router.route('/tricks/categories')
  
      // Get all the categories
      .post(AuthMethods.isAdmin, function(req, res) {
        var category = new Categories();

        category.createdBy = req.user.name;
        category.name = req.body.name;
        
        category.save(function(err) {
          if (err)
              res.send(err);
          
          res.json({ message: 'Category created!' });
        });
    });

}