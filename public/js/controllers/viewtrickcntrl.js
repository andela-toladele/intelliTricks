myApp.controller('viewTrickCntrl', ['$rootScope', '$scope', '$state', '$stateParams', 'ApiServ', function($rootScope, $scope, $state, $stateParams, ApiServ) {

  $scope.postId = $stateParams.id;
  $scope.editMode = false;

  var aceModes = ['javascript', 'java', 'python', 'ruby', 'xml', 'php'];


  //Included due to ui ace edit mode conflicts on mobile
  var viewDiv = document.getElementById("viewDiv");
  var editDiv = document.getElementById("editDiv");

  $scope.contentLoaded = false;
  
  $scope.likeTrick = function(){
    
    if($rootScope.loggedIn && $scope.post){

      ApiServ.likeTrick($scope.postId).success(function(data){
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

  $scope.userLoggedIn = function(){
    return $rootScope.loggedIn;
  }

  ApiServ.getTrick($scope.postId).success(function(data){

      console.log(data);
      $scope.post = data;
      $scope.url = "http://intellitricks.com/#!/tricks?id=" + $scope.postId;
      $scope.contentLoaded = true;

      if(!$scope.post)
        return;

      if (aceModes.indexOf(angular.lowercase($scope.post.category.name)) !== -1){
        $scope.aceModel = angular.lowercase($scope.post.category.name);
      }else{
        $scope.aceModel = 'javascript';
      }
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
    editDiv.style.display = "block";
    viewDiv.style.display = "none";
    
  }

  $scope.cancelEditTrick = function(){
    $scope.postEditMode = false;
    $scope.post.text = angular.copy($scope.tempPost);
    editDiv.style.display = "none";
    viewDiv.style.display = "block";
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
      
      editDiv.style.display = "none";
      viewDiv.style.display = "block";
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

  $scope.isAdmin = function(){
    return $scope.userType === "admin"
  }

  $scope.deleteTrick = function(){

    $scope.postErrorMessage = "";
    $scope.invalidPost = false;

   
    ApiServ.deleteTrick($scope.postId)
    .success(function(data){

      $scope.post = null;

    })
    .error(function(err, status){
      $scope.invalidPost = true;
      if(status == 401){
        $scope.postErrorMessage = "Please login to as admin to delete trick";
      }else{
        $scope.postErrorMessage = "An error occured, please try again!";
      }
    });

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

}]);