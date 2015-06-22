myApp.factory('ApiServ', function($http){
  var apiFactory = {};

  apiFactory.getUser = function(){

    return $http.get("/api/user");

  }

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

  apiFactory.getAllTricks = function(){

    return $http.get("/api/tricks");

  }

  apiFactory.getTrick = function(id){

    return $http.get("/api/trick/" + id);

  }

  apiFactory.updateTrick = function(id, text){

    return $http.put("/api/trick/" + id, text);

  }

  apiFactory.getCategories = function(){

    return $http.get("/api/categories");

  }

  apiFactory.getTricksByCategory = function(id){

    return $http.get("/api/categories/" + id);

  }

  apiFactory.createTrick = function(trick){

    return $http.post("/api/tricks/create", trick);

  }

  apiFactory.postComment = function(postId, trick){

    return $http.post("/api/tricks/comment/" + postId, trick);

  }

  apiFactory.likeTrick = function(postId){

    return $http.post("/api/tricks/like/" + postId);

  }

  apiFactory.deleteTrick = function(postId){

    return $http.delete("/api/tricks/delete/" + postId);

  }

  return apiFactory;

});