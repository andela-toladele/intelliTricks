myApp.controller('tricksCntrl', ['$rootScope', '$scope', '$state', '$stateParams','$timeout', 'ApiServ', function($rootScope, $scope, $state, $stateParams, $timeout, ApiServ) {
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

      $timeout(function () {
       $rootScope.$broadcast('masonry.reload');
       }, 500);
      }
}]);