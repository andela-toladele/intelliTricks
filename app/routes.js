var User     = require('./models/user');
var Post     = require('./models/post');
var Categories     = require('./models/categories');
var Tag     = require('./models/tag');
var AuthMethods = require('./middleware/authmethods');
var UtilMethods = require('./middleware/utils');

// expose the routes to our app with module.exports
module.exports = function(router) {
    
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
    .post(function(req, res) {
      
      UtilMethods.createUser(req, res, 'user');  
        
    });


  router.route('/adminsignup')

    // create a new user if there is no existing user with same username
    .post(AuthMethods.isAdmin, function(req, res) {
      
      UtilMethods.createUser(req, res, 'admin');   
   
   });


    
  router.route('/login')

    // login user
    .post(function(req, res) {
      req.loggedIn = false;
      User.findOne({username: req.body.username}, function(err, user) {
        if (err)
          res.send(err);

        console.log(user);

        if(!user){
          console.log(1);
          res.json({ message: 'User does not exist!' });
          return;
        }

        console.log(2);
        console.log(req.body.password)

        if(user.password !== req.body.password){

          res.json({ message: 'Wrong password!' });
          return;
        }
        
        req.loggedIn = true;
        req.userType = user.userType;
        req.userName = user.username;
        res.json(user);

      });
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