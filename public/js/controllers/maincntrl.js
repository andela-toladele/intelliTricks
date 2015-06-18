myApp.controller('LoginPaneCntrl', ['$rootScope', '$scope', 'ApiServ', function($rootScope, $scope, ApiServ) {

  ApiServ.getUser().success(function(data){    

    $rootScope.loggedIn = $scope.loggedIn = true;
    $rootScope.username = $scope.username = data.username;
    $rootScope.userId = $scope.userId = data._id;
    $rootScope.userType = $scope.userType = data.userType;

  });

  $scope.$watch(function() {
    return $rootScope.loggedIn;
  }, function() {

    $scope.loggedIn = $rootScope.loggedIn;
    console.log(10,$scope.loggedIn);
    $scope.username = $rootScope.username;
    $scope.userId = $rootScope.userId;
    $scope.userType = $rootScope.userType;    
  
  }, true);


  $scope.logoutUser = function(){
    ApiServ.logout().success(function(data){

      $rootScope.loggedIn = $scope.loggedIn = false;
      $rootScope.username = $scope.username = null;
      $rootScope.userId = $scope.userId = null;
      $rootScope.userType = $scope.userType = null;

    });

  }

}])
.controller('loginCntrl', ['$rootScope', '$scope', '$state', 'ApiServ', function($rootScope, $scope, $state, ApiServ) {
  
  $scope.loginUser = function(){
    $scope.errorMessage = "";
    $scope.invalidLogin = false;

    

    if($scope.username=="" || !$scope.username || !$scope.password)
      return;

    
    var user = {username: angular.lowercase($scope.username), password: $scope.password};

    ApiServ.login(user).success(function(data){

      console.log(data);

      $rootScope.username = data.data.username;
      $rootScope.userId = data.data._id;
      $rootScope.userType = data.data.userType;
      $rootScope.loggedIn = true;

      $state.go("home");

    })
    .error(function(err, status){
      $scope.invalidLogin = true;
      if(status == 401){
        $scope.errorMessage = "Invalid login details";
      }else{
        $scope.errorMessage = "Error occured during login";
      }
    });


  }  

}])
.controller('registerCntrl', ['$rootScope', '$scope', '$state', 'ApiServ', function($rootScope, $scope, $state, ApiServ) {
  $scope.createUser = function(){
    $scope.errorMessage = "";
    $scope.invalidSignup = false;

    console.log(1,$scope.username, $scope.password, $scope.passwordConf, $scope.email);

    if($scope.username=="" || !$scope.username || !$scope.password || !$scope.email || !$scope.passwordConf)
      return;

    if($scope.password !== $scope.passwordConf){
      $scope.invalidSignup = true;
      $scope.errorMessage = "Passwords do not match";
      return;
    }
    var user = {username: angular.lowercase($scope.username), password: $scope.password, email: angular.lowercase($scope.email)};

    ApiServ.signUp(user).success(function(data){

      console.log(data);

      $rootScope.username = data.data.username;
      $rootScope.userId = data.data._id;
      $rootScope.userType = data.data.userType;
      $rootScope.loggedIn = true;

      $state.go("home");

    })
    .error(function(err, status){
      $scope.invalidSignup = true;
      if(status == 401){
        $scope.errorMessage = "User with same email or username found";
      }else{
        $scope.errorMessage = "Error occured during login";
      }
    });
  }

}])
.controller('newTrickCntrl', ['$scope', '$state', 'ApiServ', function($scope, $state, ApiServ) {

  document.getElementById("browse").setAttribute("class","");
  document.getElementById("createNew").setAttribute("class","active");
  document.getElementById("categories").setAttribute("class","");


  ApiServ.getCategories().success(function(data){

      console.log(data);      
      $scope.categoriesOptions = data;
  });
  
  $scope.saveTrick = function(){
    $scope.errorMessage = "";
    $scope.invalidPost = false;

    if(!$scope.title || !$scope.description){

      $scope.invalidPost = true;

      $scope.errorMessage = "Title and description fields are mandatory";

      return;

    }

    if(!$scope.code || !$scope.categorySel){

      $scope.invalidPost = true;

      $scope.errorMessage = "Type a trick and select category option";

      return;
    }

    for(var i=0; i<$scope.categoriesOptions.length; i++){
      if($scope.categoriesOptions[i]._id === $scope.categorySel){
        $scope.categoryName = $scope.categoriesOptions[i].name;
        break;
      }
    }

    ApiServ.createTrick({text: $scope.code, title: $scope.title, description: $scope.description,
     categoryId: $scope.categorySel, categoryName: $scope.categoryName})
    .success(function(data){

      console.log(data);

      $state.go('tricks', {id: data.id});

    })
    .error(function(err, status){
      $scope.invalidPost = true;
      if(status == 401){
        $scope.errorMessage = "Please login to post trick";
      }else{
        $scope.errorMessage = "An error occured, please try again!";
      }
    });
  }  


}])
.controller('viewTrickCntrl', ['$rootScope', '$scope', '$state', '$stateParams', 'ApiServ', function($rootScope, $scope, $state, $stateParams, ApiServ) {

  $scope.postId = $stateParams.id;
  $scope.editMode = false;
  $scope.editPostStyle = "none";
  $scope.contentLoaded = false;

  console.log($scope.postId);

  $scope.likeTrick = function(){
    console.log(1);
    if($rootScope.loggedIn && $scope.post){

      ApiServ.likeTrick($scope.postId).success(function(data){
        console.log(data);
        $scope.post= data;
      });
    }
  }

  $scope.canLike = function(){

    if(!$scope.post || !$rootScope.loggedIn)
      return false;
      
    for(var i=0; i<$scope.post.likes.length; i++){
      if($scope.post.likes[i].username === $rootScope.username){
        return false;
      }
    }
    return true;
  }

  ApiServ.getTrick($scope.postId).success(function(data){

      console.log(data);
      $scope.post = data;
      $scope.url = "http://intellitricks.com/#/tricks?id=" + $scope.postId;
      $scope.contentLoaded = true;   
    })
    .error(function(err, status){
       $state.go("home");

    });


  $scope.postComment = function(){
    $scope.commentErrorMessage = "";
    $scope.invalidComment = false;

    console.log($scope.comment);

    if(!$scope.comment){

      $scope.invalidComment = true;

      $scope.commentErrorMessage = "Do not leave Comment field blank";

      return;

    }

    ApiServ.postComment($scope.post._id, {text: $scope.comment})
    .success(function(data){

      console.log(data);

      $scope.post = data;
      $scope.comment = null;

    })
    .error(function(err, status){
      $scope.invalidComment = true;
      if(status == 401){
        $scope.commentErrorMessage = "Please login to post comment";
      }else{
        $scope.commentErrorMessage = "An error occured, please try again!";
      }
    });
  }

  $scope.orderCrit = function(post) {
    var date = new Date(post.when);
    return date;
  };

  $scope.showEditFields = function(){
    $scope.postEditMode = true;
    $scope.tempPost = angular.copy($scope.post.text);
    //some awkward codes because of ui-ace editor not working properly with ng-show
    $scope.editPostStyle = "block";
    
  }

  $scope.cancelEditTrick = function(){
    $scope.postEditMode = false;
    $scope.post.text = angular.copy($scope.tempPost);
    $scope.editPostStyle = "none";
  }

  $scope.updateTrick = function(){

    $scope.postErrorMessage = "";
    $scope.invalidPost = false;

    if(!$scope.post.text){

      $scope.invalidPost = true;

      $scope.postErrorMessage = "Do not leave post field blank";

      return;

    }

    ApiServ.updateTrick($scope.postId, {text: $scope.post.text})
    .success(function(data){

      console.log(data);

      $scope.postEditMode = false;
      $scope.editPostStyle = "none";
      $scope.post = data;

    })
    .error(function(err, status){
      $scope.invalidPost = true;
      if(status == 401){
        $scope.errorMessage = "Please login to as trick author to edit";
      }else{
        $scope.errorMessage = "An error occured, please try again!";
      }
    });
  }

  $scope.canEditPost = function(){

    if(!$scope.post)
      return false;

    if($rootScope.loggedIn && (($rootScope.username === $scope.post.postedBy) || $rootScope.userType === "admin"))
      return true;

    return false;

  }

  $scope.twitterShare = function(){

    window.open(
      'https://twitter.com/share?url='+encodeURIComponent($scope.url)+'&amp;text='+encodeURIComponent("'" + $scope.post.title + ": " + $scope.post.description.substring(0, 40) + "...") + '&amp;count=none/',
      'twitter-share-dialog',
      'width=626,height=436,top='+((screen.height - 436) / 2)+',left='+((screen.width - 626)/2 ));
    return false;
  }

  $scope.facebookShare = function(){

    window.open(
      'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent($scope.url) +'&amp;text=' + encodeURIComponent("'" + $scope.post.title + ": " + $scope.post.description.substring(0, 40) + "...'"),
      'facebook-share-dialog',
      'width=626,height=436,top='+((screen.height - 436) / 2)+',left='+((screen.width - 626)/2 ));
    return false;
  }

}])
.controller('tricksCntrl', ['$scope', '$state', '$stateParams', 'ApiServ', function($scope, $state, $stateParams, ApiServ) {
  document.getElementById("recent").setAttribute("class","active");
  document.getElementById("popular").setAttribute("class","");
  document.getElementById("discussed").setAttribute("class","");

  document.getElementById("browse").setAttribute("class","");
  document.getElementById("createNew").setAttribute("class","");
  document.getElementById("categories").setAttribute("class","");

 $scope.orderCrit = function(post) {
    var date = new Date(post.when);
    return date;
  };


  
  if(!$stateParams.id){
    document.getElementById("browse").setAttribute("class","active");

    $scope.pageTitle = "Recent tricks";

    ApiServ.getAllTricks().success(function(data){
      $scope.tricks = data;
      $scope.apiCallReturned = true;       
    })
    .error(function(err){
      $scope.apiCallReturned = true;
    });
    
    }else{

        document.getElementById("categories").setAttribute("class","active");

        ApiServ.getTricksByCategory($stateParams.id).success(function(data){
          $scope.tricks = data;
          $scope.apiCallReturned = true; 
        })
        .error(function(err){
          $scope.apiCallReturned = true;
        });;

        $scope.pageTitle = $stateParams.name;
    }

    $scope.updateOrderCrit = function(option){

      document.getElementById("recent").setAttribute("class","");
      document.getElementById("popular").setAttribute("class","");
      document.getElementById("discussed").setAttribute("class","");

      switch(option){

        case 2:

        document.getElementById("discussed").setAttribute("class","active");

        if(!$stateParams.id)
          $scope.pageTitle = "Most discussed tricks";

        $scope.orderCrit = "comments.length";

        break;
      case 1:
        document.getElementById("popular").setAttribute("class","active");

        if(!$stateParams.id)
          
          $scope.pageTitle = "Most popular tricks";

        $scope.orderCrit = "viewed";

        break;

      case 0: 

        document.getElementById("recent").setAttribute("class","active");

        if(!$stateParams.id)
          $scope.pageTitle = "Recent tricks";

        $scope.orderCrit = function(post) {
          var date = new Date(post.when);
          return date;
        };

        break;
      }
    }
}])
.controller('categoriesCntrl', ['$scope', 'ApiServ', function($scope, ApiServ) {

  document.getElementById("browse").setAttribute("class","");
  document.getElementById("createNew").setAttribute("class","");
  document.getElementById("categories").setAttribute("class","active");


  ApiServ.getCategories().success(function(data){
    console.log(data);
    $scope.categories = data;
    $scope.apiCallReturned = true;    
  });

}]);

