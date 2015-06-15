myApp.controller('LoginPaneCntrl', ['$rootScope', '$scope', 'ApiServ', function($rootScope, $scope, ApiServ) {


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

      console.log(data);

      
      $rootScope.loggedIn = $scope.loggedIn = false;
      $rootScope.username = $scope.username = "";
      $rootScope.userId = $scope.userId = "";
      $rootScope.userType = $scope.userType = ""; 


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
.controller('viewTrickCntrl', ['$scope', '$state', '$stateParams', 'ApiServ', function($scope, $state, $stateParams, ApiServ) {

  var postId = $stateParams.id;
  console.log(postId);

  ApiServ.getTrick(postId).success(function(data){

      console.log(data);
      $scope.post = data;     
    })
    .error(function(err, status){
       $state.go("home");

    });



}])
.controller('tricksCntrl', ['$scope', '$state', '$stateParams', 'ApiServ', function($scope, $state, $stateParams, ApiServ) {
  document.getElementById("recent").setAttribute("class","");
  document.getElementById("popular").setAttribute("class","");
  document.getElementById("discussed").setAttribute("class","");

  var isCategory;

  if(!$stateParams.by && !$stateParams.id){
    document.getElementById("recent").setAttribute("class","active");

    $scope.pageTitle = "Recent tricks";

    $scope.orderCrit = function(post) {
      var date = new Date(post.when);
      return date;
    };
    
  }else{

    var section = $stateParams.by;

    switch(section){
      case "discussed":

        document.getElementById("discussed").setAttribute("class","active");
        $scope.pageTitle = "Most Discussed tricks";
        $scope.orderCrit = "comments.length";

        break;
      case "popular":
        document.getElementById("popular").setAttribute("class","active");
        $scope.pageTitle = "Most popular tricks";
        $scope.orderCrit = "viewed";

        break;

      default: //when viewing trick for a category

        document.getElementById("recent").setAttribute("class","active");

        isCategory = true;
        
        $scope.orderCrit = function(post) {
          var date = new Date(post.when);
          return date;
        };

        console.log($stateParams);

        ApiServ.getTricksByCategory($stateParams.id).success(function(data){
          $scope.tricks = data;   
        });

        $scope.pageTitle = $stateParams.name;
        break;

    }

  }

  if (!isCategory){
    ApiServ.getAllTricks().success(function(data){
      $scope.tricks = data;      
    });
  }
  
}])
.controller('categoriesCntrl', ['$scope', 'ApiServ', function($scope, ApiServ) {

  ApiServ.getCategories().success(function(data){
    console.log(data);
    $scope.categories = data;      
  });

}]);

