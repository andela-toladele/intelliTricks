myApp.controller('loginCntrl', ['$rootScope', '$scope', '$state', 'ApiServ', function($rootScope, $scope, $state, ApiServ) {
  
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

}]);