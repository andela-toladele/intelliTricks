myApp.controller('registerCntrl', ['$rootScope', '$scope', '$state', 'ApiServ',function($rootScope, $scope, $state, ApiServ) {
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


}]);