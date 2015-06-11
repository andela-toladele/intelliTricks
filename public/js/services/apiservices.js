myApp.factory('ApiServ', function(){
  var apiFactory = {};

  apiFactory.signUp = function(user){

    return $http.post("/api/signup", user);

  }

  apiFactory.login = function(user){

    return $http.post("/api/login", user);

  }

  apiFactory.adminSignUp = function(user){

    return $http.post("/api/adminsignup", user);

  }

  apiFactory.logout = function(){

    return $http.post("/api/logout");

  }

  apiFactory.getTricks = function(){

    return $http.get("/api/tricks");

  }

  apiFactory.getCategories = function(){

    return $http.get("/api/categories");

  }

  apiFactory.getByCategory = function(id){

    return $http.get("/api/categories" + id);

  }

  apiFactory.createTrick = function(trick){

    return $http.post("/api/tricks/create", trick);

  }

  apiFactory.postComment = function(postId, trick){

    return $http.post("/api/tricks/comments/" + postId, trick);

  }


  return apiFactory;

});