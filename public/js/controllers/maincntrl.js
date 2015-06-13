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

    console.log(1,$scope.username, $scope.password);

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
    var user = {username: angular.lowercase($scope.username), password: $scope.password, email: $scope.email};

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
.controller('newTrickCntrl', ['$rootScope', '$scope', '$state', 'ApiServ', function($rootScope, $scope, $state, ApiServ) {
  
}]);

