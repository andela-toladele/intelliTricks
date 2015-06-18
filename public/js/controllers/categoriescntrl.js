myApp.controller('categoriesCntrl', ['$scope', 'ApiServ', function($scope, ApiServ) {

  document.getElementById("browse").setAttribute("class","");
  document.getElementById("createNew").setAttribute("class","");
  document.getElementById("categories").setAttribute("class","active");


  ApiServ.getCategories().success(function(data){
    console.log(data);
    $scope.categories = data;
    $scope.apiCallReturned = true;    
  });

}]);