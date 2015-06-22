myApp.controller('newTrickCntrl', ['$scope', '$state', 'ApiServ', function($scope, $state, ApiServ){

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