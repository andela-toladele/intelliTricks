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

}]);