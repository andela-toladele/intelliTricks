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

}]);