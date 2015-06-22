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

  router.route('/user')
  
    // Get all tricks posted
    .get(function(req, res) {
      if(req.user)
        return res.json(req.user);

      return res.send(401,{ success : false, message : 'No user in session!'});

    });

  router.route('/tricks')
  
    // Get all tricks posted
    .get(function(req, res) {

      // Load all posts
      Post.find(function(err, posts) {

        if (err)
          return res.send(err);

        res.json(posts);
      });

    });

    router.route('/trick/:trick_id')
  
      // Get a trick
      .get(function(req, res) {

        // Load all posts
        Post.findByIdAndUpdate(req.params.trick_id, { $inc: {"viewed" : 1} }, function(err, post) {

          if (err)
            return res.send(err);

          if(post)
            post.viewed += 1;

          res.json(post);
        });

      })
       // Update a trick
      .put(AuthMethods.isLoggedIn, function(req, res) {

        var text = req.body.text;
        
        Post.findById(req.params.trick_id, function(err, post) {

          if (err)
            return res.send(err);

          if(!req.user || (req.user.username !== post.postedBy && req.user.userType !== "admin"))
            return res.send(401, 'Please login as post author!');

          post.text = text;
          post.save(function(err, model) {
            if(err){
              return res.send(err);
            }          
            res.json(model);
          });          
        });

      });


    router.route('/categories')
  
      // Get all the categories
      .get(function(req, res) {
        Categories.find(function(err, categories) {
          if (err)
            return res.send(err);
          
          res.json(categories);
        });

    });

    router.route('/categories/:category_id')
  
      // Get all tricks posted for a category
      .get(function(req, res) {
        Post.find({'category.id': req.params.category_id}, function(err, posts) {
          if (err)
            return res.send(err);

          res.json(posts);
      });

    });

    router.route('/tricks/tags')
  
      // Get all the categories
      .get(function(req, res) {
        Tag.find(function(err, tags) {
          if (err)
            return res.send(err);
          
          res.json(tags);
        });

    });

    router.route('/tricks/tags/:tag_name')
  
      // Get all tricks posted for a category
      .get(function(req, res) {
        Post.find({tag: req.params.tag_name}, function(err, posts) {
          if (err)
            return res.send(err);

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
      post.category.id = req.body.categoryId;
      post.category.name = req.body.categoryName;
      //post.tag = req.body.tag;

      post.save(function(err, postedData) {
        if (err)
            return res.send(err);
        req.postId = postedData._id;

        res.json({ message: 'Post created!', id: postedData._id});
      });
    });

    router.route('/tricks/disquscomment/:post_id')

    // post comment by a logged in user
    .post(function(req, res) {
      
      Post.findByIdAndUpdate(
       req.params.post_id,
       { $push: {"comments": {text: '', commentBy: 'from_disqus', when: Date.now()}}},
       {  safe: true, upsert: true, new: true},
         function(err, model) {
          if(err){
            return res.send(err);
          }
            console.log(model);
            return res.json(model);
        });
      
    });


    router.route('/tricks/like/:post_id')

    // post comment by a logged in user
    .post(AuthMethods.isLoggedIn, function(req, res) {
      
      Post.findByIdAndUpdate(
       req.params.post_id,
       { $push: {"likes": {username: req.user.username}}},
       {  safe: true, upsert: true, new: true},
         function(err, model) {
          if(err){
            return res.send(err);
          }
            console.log(model);
            return res.json(model);
        });
      
    });

    router.route('/tricks/delete/:post_id')

    // post comment by a logged in user
    .delete(AuthMethods.isAdmin, function(req, res) {

      Post.remove({_id: req.params.post_id}, function(err){
        if(err){
          return res.send(err);
        }
        return res.json({message: 'Post deleted!'});

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

    router.route('/comment/:trick_id')

    // login user
    .get(function(req, res) {
      
      var Disqus = require('disqus');
      console.log(req.params.trick_id);

      var disqus = new Disqus({
          api_secret : 'PzFVHmOfrnSZ5RKgkfs48Ys3s8UW116XlNPDLNVIIcsrzfFIiJyz002tqgpNY8vq',
          api_key : 'GXrRIu20sO9HSPlZrmyI1eyujsxXWSm4lr5gtvvDFLsUfBNSGpAnOHKqwIZA3FUJ',
          access_token : 'b114a1fc815d49de8ac0964d4aa88195'
      });

      disqus.request('posts/list', { forum : 'intellitricks'}, function(data) {
        if (data.error) {
            console.log('Something went wrong...');
        } else {
            console.log(data);
            res.json(data);
        }
    });
  });

}