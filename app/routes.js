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


  router.route('/')

    // create a new user if there is no existing user with same username
    .get(function(req, res, next) {
      req.logout();
      return res.send({ success : true, message : 'API where you at!' });   
    }); 
  
  // on routes that end in /signup
  // ----------------------------------------------------
  router.route('/signup')

    // create a new user if there is no existing user with same username
    .post(function(req, res, next) {
      req.body.usertype = 'user';
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (user.duplicate) {
          return res.send(401,{ success : false, message : 'Same username or email found!' });
        }else{

          user.loggedIn = true;
          req.login(user, function(err){
            if(err){
              return next(err);
            }

            return res.send({ success : true, message : 'User successfully registered!', data: user});        
          });
        }
      }
    )(req, res, next);
  }); 
        
   

  router.route('/adminsignup')
    // create a new user if there is no existing user with same username
    .post(AuthMethods.isAdmin, function(req, res, next) {
      req.body.usertype = 'admin';
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (user.duplicate) {
          return res.send(401,{ success : false, message : 'Same username or email found!' });
        }else{
            
            return res.send({ success : true, message : 'User successfully registered!', data: user });        
        
        }
    })(req, res, next);
  });


  // on routes that end in /signup
  // ----------------------------------------------------
  router.route('/logout')

    // create a new user if there is no existing user with same username
    .post(function(req, res, next) {
      req.logout();
      return res.send({ success : true, message : 'User logged out!' });   
    }); 


    
  router.route('/login')

    // create a new user if there is no existing user with same username
    .post(function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
        if (err) {

          return next(err); // will generate a 500 error
        }

        console.log(user);
        // Generate a JSON response reflecting authentication status
        if (!user) {
          

          return res.send(401, 'Authentication failed!');
        }else{
          console.log(123);
          user.loggedIn = true;
          req.login(user, function(err){
            if(err){
              return next(err);
            }
            return res.json({ success : true, message : 'User logged in!', data: user});        
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

    router.route('/trick/:trick_id')
  
    // Get all tricks posted
    .get(function(req, res) {

      // Load all posts
      Post.findByIdAndUpdate(req.params.trick_id, { $inc: {"viewed" : 1} }, function(err, post) {

        if (err)
          res.send(err);

        res.json(post);
      });

    });


    router.route('/categories')
  
      // Get all the categories
      .get(function(req, res) {
        Categories.find(function(err, categories) {
          if (err)
            res.send(err);
          
          res.json(categories);
        });

    });

    router.route('/categories/:category_name')
  
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

      post.postedBy = req.user.username;
      post.title = req.body.title;
      post.text = req.body.text;
      post.description = req.body.description;
      post.category.id = req.body.category.id;
      post.category.name = req.body.category.name;
      post.tag = req.body.tag;

      post.save(function(err, postedData) {
        if (err)
            res.send(err);
        req.postId = postedData._id;

        res.json({ message: 'Post created!', id: postedData._id});
      });
    });

    router.route('/tricks/comments/:post_id')

    // post comment by a logged in user
    .post(AuthMethods.isLoggedIn, function(req, res) {
      req.body.commentBy = req.user.username;
      Post.findByIdAndUpdate(
       req.params.post_id,
       { $push: {"comments": {text: req.body.text, commentBy: req.body.commentBy}}},
       {  safe: true, upsert: true},
         function(err, model) {
          if(err){
            return res.send(err);
          }
            console.log(model);
            return res.json({message: 'Comment posted!', data: model});
        });
      
    });

    router.route('/categories/create')
  
      // Get all the categories
      .post(AuthMethods.isAdmin, function(req, res) {
        var category = new Categories();

        category.createdBy = req.user.username;

        category.name = req.body.name;
        
        category.save(function(err, model) {
          if(err){
            if (err.code == 11000)
              return res.send(422,{ success : false, message : 'Duplicate found!' });
            return res.send(err);
          }
          
          
          res.json({ message: 'Category created!', data: model});
        });
    });

}