myApp.config(function($stateProvider, $urlRouterProvider,$provide,$locationProvider){
  

  $provide.decorator('$sniffer', function($delegate) {
      $delegate.history = false;
      return $delegate;
  });

  $locationProvider
    .html5Mode(true)
    .hashPrefix('!');;

  $urlRouterProvider.otherwise("/home");
  
  $stateProvider.
    state('home',{
      url: '/home',
      templateUrl: '/partials/tricks.html'
    }).
    state('categories',{
      url: '/categories',
      templateUrl: '/partials/categories.html'  
    }).
    state('newtrick',{
      url: '/createTrick',
      templateUrl: '/partials/createtrick.html',
      controller: function($rootScope, $state){
        if(!$rootScope.loggedIn){
          $state.go("login");
        }
      }
    }).
    state('login',{
      url: '/login',
      templateUrl: '/partials/login.html'      
    }).
    state('register',{
      url: '/register',
      templateUrl: '/partials/signup.html',
      controller: 'registerCntrl'
    }).
    state('tricks',{
      url: '/tricks?id',
      templateUrl: '/partials/viewtrick.html'
    }).
    state('category',{
      url: '/category?id&name',
      templateUrl: '/partials/tricks.html'
    });
   
});